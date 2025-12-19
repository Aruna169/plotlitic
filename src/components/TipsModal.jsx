import './CommentModal.css';

function TipsModal({ isOpen, onClose }) {
    if (!isOpen) return null;

    const tips = [
        {
            icon: "📊",
            title: "Works Best with Spreadsheets",
            description: "Use spreadsheets for precalculations."
        },
        {
            icon: "✨",
            title: "Smart Paste Magic",
            description: "Smart Paste can paste two columns from a spreadsheet at once - even if they're not adjacent! Just copy any two columns and paste."
        },
        {
            icon: "🎯",
            title: "Use Squeeze for Simple Scaling",
            description: "Adjust the squeeze (margins) to get simpler, more convenient scaling factors for your graph."
        },

        {
            icon: "📝",
            title: "Manual Entry Tips",
            description: "Enter data points one by one, or use the 'Quick Add' section to paste multiple values as new lines."
        },
        {
            icon: "🔍",
            title: "Round Trip Validation",
            description: "Check the validation tab to verify"
        }
    ];

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
                <div className="modal-header">
                    <h3>💡 Tips & Tricks</h3>
                    <button className="modal-close" onClick={onClose}>✕</button>
                </div>

                <div className="modal-body" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                        {tips.map((tip, index) => (
                            <div
                                key={index}
                                style={{
                                    padding: 'var(--spacing-sm)',
                                    background: 'var(--bg-secondary)',
                                    borderRadius: 'var(--radius-md)',
                                    border: '1px solid var(--border-subtle)'
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--spacing-sm)' }}>
                                    <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>{tip.icon}</span>
                                    <div>
                                        <h4 style={{ margin: '0 0 4px 0', color: 'var(--text-primary)', fontSize: '0.9375rem' }}>
                                            {tip.title}
                                        </h4>
                                        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: '1.5' }}>
                                            {tip.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="modal-footer">
                    <button
                        type="button"
                        onClick={onClose}
                        className="btn-primary"
                    >
                        Got it!
                    </button>
                </div>
            </div>
        </div>
    );
}

export default TipsModal;
