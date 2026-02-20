"use client";

import React, { useState } from "react";
import { ChevronDown, CheckCircle2 } from "lucide-react";
import { FormattedText } from "./formatted-text";

interface CollapsibleExampleProps {
    content: string;
    initialPreviewLines?: number;
}

export function CollapsibleExample({ content, initialPreviewLines = 8 }: CollapsibleExampleProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    if (!content) return null;

    const lines = content.split('\n');
    const isLong = lines.length > initialPreviewLines;
    const previewText = isLong && !isExpanded
        ? lines.slice(0, initialPreviewLines).join('\n')
        : content;

    return (
        <div style={{ marginTop: '2rem' }}>
            <h3 style={{
                fontSize: '1.1rem',
                fontWeight: 'bold',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
            }}>
                <CheckCircle2 size={18} color="#10B981" /> Exemplo de Uso
            </h3>
            <div style={{
                backgroundColor: '#111827',
                borderRadius: '0.75rem',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                overflow: 'hidden',
                position: 'relative'
            }}>
                <div style={{
                    padding: '1.5rem',
                    color: '#D1D5DB',
                    fontSize: '0.9rem',
                    position: 'relative',
                    maxHeight: isLong && !isExpanded ? '300px' : 'none',
                    overflow: 'hidden',
                    transition: 'max-height 0.3s ease'
                }}>
                    <FormattedText text={previewText} />

                    {/* Gradient fade overlay when collapsed */}
                    {isLong && !isExpanded && (
                        <div style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            height: '80px',
                            background: 'linear-gradient(to bottom, transparent, #111827)',
                            pointerEvents: 'none'
                        }} />
                    )}
                </div>

                {/* Expand/Collapse button */}
                {isLong && (
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            width: '100%',
                            padding: '0.75rem',
                            backgroundColor: 'rgba(59, 130, 246, 0.05)',
                            borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                            border: 'none',
                            borderTopWidth: '1px',
                            borderTopStyle: 'solid',
                            borderTopColor: 'rgba(255, 255, 255, 0.05)',
                            color: '#60A5FA',
                            cursor: 'pointer',
                            fontSize: '0.85rem',
                            fontWeight: '500',
                            transition: 'background-color 0.2s'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.05)';
                        }}
                    >
                        <ChevronDown
                            size={16}
                            style={{
                                transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                                transition: 'transform 0.2s'
                            }}
                        />
                        {isExpanded ? 'Recolher exemplo' : 'Ver exemplo completo'}
                    </button>
                )}
            </div>
        </div>
    );
}
