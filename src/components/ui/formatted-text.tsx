"use client";

import React from "react";

/**
 * Renders markdown-like text with proper formatting:
 * - Bullet points (•, ◦, -, ●, ○)
 * - Numbered lists
 * - Headers (## )
 * - Line breaks
 * - Bold (**text**)
 * - Arrows (→)
 */
export function FormattedText({ text, style }: { text: string; style?: React.CSSProperties }) {
    if (!text) return null;

    const lines = text.split('\n');
    const elements: React.ReactNode[] = [];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmed = line.trim();

        // Empty line = paragraph break
        if (trimmed === '') {
            elements.push(<div key={i} style={{ height: '0.5rem' }} />);
            continue;
        }

        // ## Header
        if (trimmed.startsWith('## ')) {
            elements.push(
                <h4 key={i} style={{
                    fontSize: '1rem',
                    fontWeight: '700',
                    color: '#60A5FA',
                    marginTop: i > 0 ? '1rem' : '0',
                    marginBottom: '0.5rem',
                    letterSpacing: '0.02em'
                }}>
                    {trimmed.slice(3)}
                </h4>
            );
            continue;
        }

        // Bullet point (•, ●, -)
        const bulletMatch = trimmed.match(/^[•●\-]\s*(.*)/);
        if (bulletMatch) {
            elements.push(
                <div key={i} style={{
                    display: 'flex',
                    gap: '0.5rem',
                    paddingLeft: '0.5rem',
                    marginBottom: '0.25rem'
                }}>
                    <span style={{ color: '#3B82F6', flexShrink: 0 }}>•</span>
                    <span>{formatInlineText(bulletMatch[1])}</span>
                </div>
            );
            continue;
        }

        // Sub-bullet (◦, ○)
        const subBulletMatch = trimmed.match(/^[◦○]\s*(.*)/);
        if (subBulletMatch) {
            elements.push(
                <div key={i} style={{
                    display: 'flex',
                    gap: '0.5rem',
                    paddingLeft: '1.5rem',
                    marginBottom: '0.25rem'
                }}>
                    <span style={{ color: '#6B7280', flexShrink: 0 }}>◦</span>
                    <span>{formatInlineText(subBulletMatch[1])}</span>
                </div>
            );
            continue;
        }

        // Numbered list
        const numberedMatch = trimmed.match(/^(\d+)[\.\)]\s*(.*)/);
        if (numberedMatch) {
            elements.push(
                <div key={i} style={{
                    display: 'flex',
                    gap: '0.5rem',
                    paddingLeft: '0.5rem',
                    marginBottom: '0.3rem'
                }}>
                    <span style={{ color: '#F59E0B', fontWeight: '600', flexShrink: 0, minWidth: '1.5rem' }}>
                        {numberedMatch[1]}.
                    </span>
                    <span>{formatInlineText(numberedMatch[2])}</span>
                </div>
            );
            continue;
        }

        // Regular paragraph line
        elements.push(
            <p key={i} style={{ marginBottom: '0.2rem' }}>
                {formatInlineText(trimmed)}
            </p>
        );
    }

    return <div style={{ lineHeight: '1.6', ...style }}>{elements}</div>;
}

/**
 * Format inline text: bold, arrows, placeholders
 */
function formatInlineText(text: string): React.ReactNode {
    // Simple bold handling: **text**
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={i} style={{ color: '#E5E7EB', fontWeight: '600' }}>{part.slice(2, -2)}</strong>;
        }
        // Highlight placeholders [VARIABLE]
        const withPlaceholders = part.split(/(\[[A-ZÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ\s\/\-\+\&]+\])/gi);
        return withPlaceholders.map((sub, j) => {
            if (/^\[.+\]$/.test(sub) && sub.length < 60) {
                return (
                    <span key={`${i}-${j}`} style={{
                        color: '#F59E0B',
                        backgroundColor: 'rgba(245, 158, 11, 0.1)',
                        padding: '0.1rem 0.3rem',
                        borderRadius: '0.25rem',
                        fontWeight: '500',
                        fontSize: '0.9em'
                    }}>
                        {sub}
                    </span>
                );
            }
            // Highlight arrows
            if (sub.includes('→')) {
                const arrowParts = sub.split('→');
                return arrowParts.map((ap, k) => (
                    <React.Fragment key={`${i}-${j}-${k}`}>
                        {k > 0 && <span style={{ color: '#3B82F6', margin: '0 0.2rem' }}>→</span>}
                        {ap}
                    </React.Fragment>
                ));
            }
            return sub;
        });
    });
}
