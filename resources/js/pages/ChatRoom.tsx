import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Head, Link, useForm } from '@inertiajs/react';
import { index, store } from '@/routes/chat';
import { ArrowLeft, MessageSquareCode, Search, SendHorizontal } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface User {
    id: number;
    name: string;
    email: string;
    avatar_url: string;
}

interface Message {
    id: number;
    sender_id: number;
    receiver_id: number;
    body: string;
    created_at: string;
    sender?: User;
}

interface ChatRoomProps {
    auth: {
        user: User;
    };
    receiver: User | null;
    messages: Message[];
    users: User[];
}

// Synthesize a pleasant dual-tone chime sound via Web Audio API
const playNotificationSound = () => {
    try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContextClass) return;

        const audioCtx = new AudioContextClass();
        const playTone = (freq: number, startTime: number, duration: number) => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();

            osc.connect(gain);
            gain.connect(audioCtx.destination);

            osc.frequency.setValueAtTime(freq, startTime);
            gain.gain.setValueAtTime(0.1, startTime);
            gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

            osc.start(startTime);
            osc.stop(startTime + duration);
        };

        const now = audioCtx.currentTime;
        playTone(587.33, now, 0.08); // D5 chime
        playTone(880.00, now + 0.08, 0.2); // A5 chime
    } catch (e) {
        console.warn('Failed to play notification sound:', e);
    }
};

export default function ChatRoom({ auth, receiver, messages, users }: ChatRoomProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [messagesList, setMessagesList] = useState<Message[]>(messages);
    const [mobileShowSidebar, setMobileShowSidebar] = useState(!receiver);
    const [mounted, setMounted] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Sync state with updated page props from Inertia (e.g. when changing receivers or sending messages)
    useEffect(() => {
        setMessagesList(messages);
        setMobileShowSidebar(!receiver);
    }, [messages, receiver]);

    // Handle real-time incoming messages via Laravel Echo
    useEffect(() => {
        if (!auth.user.id) return;

        // Listen on the private channel unique to the authenticated user
        const channel = window.Echo.private(`chat.${auth.user.id}`);

        channel.listen('MessageSent', (event: Message) => {
            // Play notification sound
            playNotificationSound();

            // Append incoming message to state only if it belongs to the currently active conversation
            if (receiver && event.sender_id === receiver.id) {
                setMessagesList((prev) => [...prev, event]);
            }
        });

        return () => {
            window.Echo.leave(`chat.${auth.user.id}`);
        };
    }, [auth.user.id, receiver?.id]);

    // Automatically scroll to the bottom of the chat box
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messagesList]);

    // Inertia form submission for sending messages
    const { data, setData, post, processing, reset } = useForm({
        body: '',
    });

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!receiver || !data.body.trim() || processing) return;

        post(store(receiver.id).url, {
            preserveScroll: true,
            onSuccess: () => {
                reset('body');
            },
        });
    };

    // Filter contacts list based on search query
    const filteredUsers = users.filter((u) =>
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Human-friendly time formatter
    const formatTime = (dateString: string) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } catch {
            return '';
        }
    };

    // Get initials for fallback avatar
    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .slice(0, 2)
            .join('')
            .toUpperCase();
    };

    return (
        <>
            <Head title={receiver ? `Chat with ${receiver.name}` : 'Chat System'} />

            <div className="flex h-[650px] max-h-[calc(100dvh-8rem)] m-5 flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border bg-background">
                {/* 1. CONTACTS LIST (SIDEBAR) */}
                <div
                    className={`${mobileShowSidebar ? 'flex' : 'hidden'
                        } md:flex flex-col w-full md:w-80 border-r border-sidebar-border/70 dark:border-sidebar-border bg-card shrink-0 h-full overflow-hidden`}
                >
                    <div className="p-4 border-b border-sidebar-border/70 dark:border-sidebar-border">
                        <h2 className="text-lg font-bold tracking-tight mb-3">Chats</h2>
                        <div className="relative">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search contacts..."
                                className="pl-9 bg-muted/30 focus-visible:bg-transparent"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex-1 min-h-0 overflow-y-auto scrollbar-none p-2 space-y-1">
                        {filteredUsers.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-32 text-center text-muted-foreground">
                                <span className="text-sm">No contacts found</span>
                            </div>
                        ) : (
                            filteredUsers.map((u) => {
                                const isSelected = receiver?.id === u.id;
                                return (
                                    <Link
                                        key={u.id}
                                        href={index(u.id).url}
                                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${isSelected
                                            ? 'bg-primary text-primary-foreground shadow-xs'
                                            : 'hover:bg-muted/60 text-card-foreground'
                                            }`}
                                    >
                                        <Avatar className="h-10 w-10 border border-border/40">
                                            <AvatarImage src={u.avatar_url} alt={u.name} />
                                            <AvatarFallback className={isSelected ? 'bg-primary-foreground/10 text-primary-foreground' : 'bg-muted text-muted-foreground'}>
                                                {getInitials(u.name)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-sm font-semibold truncate ${isSelected ? 'text-primary-foreground' : 'text-foreground'}`}>
                                                {u.name}
                                            </p>
                                            <p className={`text-xs truncate ${isSelected ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                                                {u.email}
                                            </p>
                                        </div>
                                    </Link>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* 2. CHAT PANEL */}
                <div
                    className={`${!mobileShowSidebar ? 'flex' : 'hidden'
                        } md:flex flex-col flex-1 bg-background overflow-hidden h-full min-h-0`}
                >
                    {receiver ? (
                        <>
                            {/* CHAT HEADER */}
                            <div className="flex items-center gap-3 px-4 py-3 border-b border-sidebar-border/70 dark:border-sidebar-border bg-card">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="md:hidden"
                                    onClick={() => setMobileShowSidebar(true)}
                                >
                                    <ArrowLeft className="h-5 w-5" />
                                </Button>
                                <Avatar className="h-9 w-9 border border-border/40">
                                    <AvatarImage src={receiver.avatar_url} alt={receiver.name} />
                                    <AvatarFallback className="bg-muted text-muted-foreground">
                                        {getInitials(receiver.name)}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <h3 className="text-sm font-bold text-foreground leading-none">{receiver.name}</h3>
                                    <p className="text-xs text-muted-foreground mt-0.5">{receiver.email}</p>
                                </div>
                            </div>

                            {/* CHAT MESSAGES SCROLL AREA */}
                            <div className="flex-1 min-h-0 overflow-y-auto scrollbar-none p-4 space-y-4 bg-muted/10">
                                {messagesList.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full text-center p-8">
                                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                                            <MessageSquareCode className="h-6 w-6 text-primary" />
                                        </div>
                                        <p className="text-sm font-semibold text-foreground">No messages yet</p>
                                        <p className="text-xs text-muted-foreground mt-1 max-w-xs">
                                            Send a message to start your real-time conversation.
                                        </p>
                                    </div>
                                ) : (
                                    messagesList.map((msg, index) => {
                                        const isOutgoing = msg.sender_id === auth.user.id;
                                        return (
                                            <div
                                                key={msg.id || index}
                                                className={`flex ${isOutgoing ? 'justify-end' : 'justify-start'}`}
                                            >
                                                <div className={`max-w-[75%] md:max-w-[60%] flex flex-col`}>
                                                    <div
                                                        className={`px-4 py-2.5 shadow-xs text-sm ${isOutgoing
                                                            ? 'bg-primary text-primary-foreground rounded-2xl rounded-tr-none'
                                                            : 'bg-card text-card-foreground border border-border/50 rounded-2xl rounded-tl-none'
                                                            }`}
                                                    >
                                                        <p className="whitespace-pre-wrap break-words">{msg.body}</p>
                                                    </div>
                                                    <span
                                                        className={`text-[10px] text-muted-foreground/80 mt-1 select-none px-1 ${isOutgoing ? 'text-right' : 'text-left'
                                                            }`}
                                                    >
                                                        {mounted ? formatTime(msg.created_at) : ''}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* CHAT INPUT BAR */}
                            <form
                                onSubmit={handleSendMessage}
                                className="p-3 border-t border-sidebar-border/70 dark:border-sidebar-border bg-card flex items-center gap-2"
                            >
                                <Input
                                    placeholder={`Message ${receiver.name}...`}
                                    value={data.body}
                                    onChange={(e) => setData('body', e.target.value)}
                                    disabled={processing}
                                    maxLength={5000}
                                    className="flex-1 bg-muted/30 focus-visible:bg-transparent"
                                    autoFocus
                                />
                                <Button
                                    type="submit"
                                    size="icon"
                                    disabled={!data.body.trim() || processing}
                                    className="shrink-0"
                                >
                                    <SendHorizontal className="h-4.5 w-4.5" />
                                </Button>
                            </form>
                        </>
                    ) : (
                        /* EMPTY CHAT SCREEN (NO RECEIVER SELECTED) */
                        <div className="flex flex-col items-center justify-center flex-1 text-center p-8 bg-muted/5">
                            <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 border border-primary/20">
                                <MessageSquareCode className="h-8 w-8 text-primary" />
                            </div>
                            <h3 className="text-lg font-bold text-foreground">Real-Time Messaging</h3>
                            <p className="text-sm text-muted-foreground mt-1.5 max-w-sm">
                                Select a contact from the list on the left to start a real-time, one-on-one chat session.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

// Attach page breadcrumbs mapping for standard layout navigation
ChatRoom.layout = {
    breadcrumbs: [
        {
            title: 'Chat',
            href: '/chat',
        },
    ],
};
