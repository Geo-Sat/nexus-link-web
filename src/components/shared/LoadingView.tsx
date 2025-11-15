interface LoadingViewProps {
    headline: string;
    subline: string;
}
export function LoadingView({
    headline,
    subline,
                            }: LoadingViewProps){
    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="glass-panel p-8 text-center">
                <div className="animate-pulse-slow mb-4">
                    <div className="w-16 h-16 mx-auto bg-primary/20 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-primary" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 2L3 7v11h4v-6h6v6h4V7l-7-5z" />
                        </svg>
                    </div>
                </div>
                <h2 className="text-lg font-semibold text-foreground mb-2">
                    { headline}
                </h2>
                <p className="text-sm text-muted-foreground">
                    { subline}
                </p>
            </div>
        </div>
    )
}

