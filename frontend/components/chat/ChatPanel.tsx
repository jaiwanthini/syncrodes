"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Send, Sparkles } from "lucide-react";
import { askOrchestrator } from "@/lib/orchestrator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MarkdownMessage } from "@/components/chat/MarkdownMessage";
import { useStreamingText } from "@/hooks/useStreamingText";
import { ErrorState } from "@/components/common/ErrorState";

interface Message {
  role: "user" | "assistant";
  content: string;
  streaming?: boolean;
}

export function ChatPanel() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function handleSend() {
    if (!input.trim() || loading) return;
    const question = input.trim();
    setMessages((prev) => [...prev, { role: "user", content: question }]);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const response = await askOrchestrator({ question });
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: response.answer, streaming: true },
      ]);
    } catch {
      setError("Unable to reach the orchestrator API.");
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Something went wrong reaching the orchestrator. Please retry.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="glass flex h-[calc(100vh-8rem)] flex-col">
      <CardHeader className="border-b border-border/60">
        <CardTitle className="flex items-center gap-2 text-base">
          <Sparkles className="h-4 w-4 text-primary" />
          Syncrodes AI Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="flex min-h-0 flex-1 flex-col p-0">
        <div className="flex-1 space-y-4 overflow-y-auto p-4">
          {messages.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Ask about incidents, root causes, remediation steps, or service health.
            </p>
          ) : null}

          {messages.map((message, index) => (
            <motion.div
              key={`${message.role}-${index}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className={message.role === "user" ? "flex justify-end" : "flex justify-start"}
            >
              <div
                className={
                  message.role === "user"
                    ? "max-w-[85%] rounded-xl bg-primary px-3 py-2 text-sm text-primary-foreground"
                    : "max-w-[85%] rounded-xl border border-border bg-card px-3 py-2"
                }
              >
                {message.role === "assistant" ? (
                  <AssistantBubble content={message.content} streaming={message.streaming ?? false} />
                ) : (
                  message.content
                )}
              </div>
            </motion.div>
          ))}

          {loading ? (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="inline-flex gap-1">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary [animation-delay:120ms]" />
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary [animation-delay:240ms]" />
              </span>
              Assistant is thinking...
            </div>
          ) : null}

          {error ? <ErrorState message={error} onRetry={() => setError(null)} /> : null}
          <div ref={bottomRef} />
        </div>

        <div className="flex gap-2 border-t border-border p-3">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && void handleSend()}
            placeholder="Why is the payment service failing?"
          />
          <Button onClick={() => void handleSend()} disabled={loading}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function AssistantBubble({ content, streaming }: { content: string; streaming: boolean }) {
  const streamed = useStreamingText(content, streaming);
  return <MarkdownMessage content={streamed} />;
}
