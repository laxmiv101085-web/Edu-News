import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';

type NotificationType = 'success' | 'error' | 'info' | 'warning';

interface Notification {
    id: string;
    type: NotificationType;
    message: string;
    duration?: number;
}

interface NotificationContextType {
    showNotification: (type: NotificationType, message: string, duration?: number) => void;
    success: (message: string, duration?: number) => void;
    error: (message: string, duration?: number) => void;
    info: (message: string, duration?: number) => void;
    warning: (message: string, duration?: number) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within NotificationProvider');
    }
    return context;
};

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const removeNotification = useCallback((id: string) => {
        setNotifications((prev) => prev.filter((notification) => notification.id !== id));
    }, []);

    const showNotification = useCallback((type: NotificationType, message: string, duration = 5000) => {
        const id = Math.random().toString(36).substring(7);
        const notification: Notification = { id, type, message, duration };

        setNotifications((prev) => [...prev, notification]);

        if (duration > 0) {
            setTimeout(() => {
                removeNotification(id);
            }, duration);
        }
    }, [removeNotification]);

    const success = useCallback((message: string, duration?: number) => {
        showNotification('success', message, duration);
    }, [showNotification]);

    const error = useCallback((message: string, duration?: number) => {
        showNotification('error', message, duration);
    }, [showNotification]);

    const info = useCallback((message: string, duration?: number) => {
        showNotification('info', message, duration);
    }, [showNotification]);

    const warning = useCallback((message: string, duration?: number) => {
        showNotification('warning', message, duration);
    }, [showNotification]);

    const getIcon = (type: NotificationType) => {
        switch (type) {
            case 'success':
                return <CheckCircle className="w-5 h-5" />;
            case 'error':
                return <XCircle className="w-5 h-5" />;
            case 'warning':
                return <AlertTriangle className="w-5 h-5" />;
            case 'info':
                return <Info className="w-5 h-5" />;
        }
    };

    const getStyles = (type: NotificationType) => {
        switch (type) {
            case 'success':
                return 'bg-green-500/10 border-green-500/20 text-green-400';
            case 'error':
                return 'bg-red-500/10 border-red-500/20 text-red-400';
            case 'warning':
                return 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400';
            case 'info':
                return 'bg-blue-500/10 border-blue-500/20 text-blue-400';
        }
    };

    return (
        <NotificationContext.Provider value={{ showNotification, success, error, info, warning }}>
            {children}

            {/* Toast Container */}
            <div className="fixed top-20 right-4 z-[100] flex flex-col gap-2 max-w-md">
                <AnimatePresence>
                    {notifications.map((notification) => (
                        <motion.div
                            key={notification.id}
                            initial={{ opacity: 0, y: -20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 100, scale: 0.95 }}
                            className={`flex items-start gap-3 p-4 rounded-xl border backdrop-blur-md ${getStyles(notification.type)}`}
                        >
                            <div className="flex-shrink-0 mt-0.5">
                                {getIcon(notification.type)}
                            </div>
                            <p className="flex-1 text-sm font-medium">
                                {notification.message}
                            </p>
                            <button
                                onClick={() => removeNotification(notification.id)}
                                className="flex-shrink-0 hover:opacity-70 transition-opacity"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </NotificationContext.Provider>
    );
};
