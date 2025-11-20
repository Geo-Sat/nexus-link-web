interface ErrorViewProps {
    headline: string;
    status: string;
    subline?: string;
}
export function ErrorView({headline, status, subline}: ErrorViewProps){
    return (<div className="absolute inset-0 flex items-center justify-center bg-background">
        <div className="glass-panel p-6 max-w-md text-center">
            <h2 className="text-lg font-semibold text-destructive mb-2">
                {headline}
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
                {status}
            </p>
            <p className="text-xs text-muted-foreground">
                {subline}
            </p>
        </div>
    </div>
)}