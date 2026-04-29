import { Link } from 'react-router-dom';
import { useDarkMode } from '../context/DarkModeContext';

const Section = ({ title, children, dark }) => (
    <section style={{ marginBottom: '2.5rem' }}>
        <h2 style={{
            fontSize: '1.25rem',
            fontWeight: 700,
            color: dark ? '#f9fafb' : '#111827',
            marginBottom: '0.75rem',
            paddingBottom: '0.5rem',
            borderBottom: '2px solid #00A699',
            display: 'inline-block',
        }}>
            {title}
        </h2>
        <div style={{ color: dark ? '#d1d5db' : '#4b5563', lineHeight: '1.8', fontSize: '0.95rem' }}>
            {children}
        </div>
    </section>
);

const PrivacyPolicy = () => {
    const { dark } = useDarkMode();

    return (
        <div style={{ minHeight: '100vh', background: dark ? '#111827' : '#f9fafb', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {/* Top bar */}
            <div style={{
                background: dark ? '#1f2937' : 'white',
                borderBottom: `1px solid ${dark ? '#374151' : '#e5e7eb'}`,
                padding: '1rem 2rem',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                position: 'sticky',
                top: 0,
                zIndex: 40,
                boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
            }}>
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
                    <svg viewBox="0 0 32 32" style={{ width: '28px', height: '28px' }} fill="none">
                        <path d="M16 1C7.163 1 0 8.163 0 17c0 6.627 3.838 12.37 9.432 15.18L16 31l6.568 1.18C28.162 29.37 32 23.627 32 17 32 8.163 24.837 1 16 1z" fill="#FF385C" />
                        <path d="M16 6c-1.5 0-5 4-5 9s3.5 9 5 9 5-4 5-9-3.5-9-5-9z" fill="white" />
                    </svg>
                    <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#FF385C' }}>wanderlust</span>
                </Link>
                <span style={{ color: dark ? '#6b7280' : '#9ca3af', fontSize: '0.85rem' }}>/ Privacy Policy</span>
            </div>

            {/* Hero banner */}
            <div style={{
                background: 'linear-gradient(135deg, #00A699 0%, #00877b 60%, #006b61 100%)',
                color: 'white',
                padding: '4rem 2rem 3rem',
                textAlign: 'center',
            }}>
                <div style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    width: '64px', height: '64px', borderRadius: '50%',
                    background: 'rgba(255,255,255,0.15)', marginBottom: '1.25rem',
                }}>
                    <svg style={{ width: '32px', height: '32px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                </div>
                <h1 style={{ fontSize: 'clamp(2rem, 5vw, 2.75rem)', fontWeight: 800, margin: '0 0 0.75rem' }}>
                    Privacy Policy
                </h1>
                <p style={{ fontSize: '1rem', opacity: 0.85, maxWidth: '520px', margin: '0 auto' }}>
                    Your privacy matters to us. This policy explains what data we collect, why we collect it, and how we protect it.
                </p>
                <p style={{ marginTop: '1.25rem', fontSize: '0.8rem', opacity: 0.65 }}>
                    Last updated: April 29, 2026 · Effective immediately
                </p>
            </div>

            {/* At-a-glance highlights */}
            <div style={{ maxWidth: '860px', margin: '0 auto', padding: '2.5rem 2rem 0' }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                    gap: '1rem',
                    marginBottom: '2.5rem',
                }}>
                    {[
                        { icon: '🔒', title: 'Data Security', desc: 'Your data is encrypted at rest and in transit using industry-standard protocols.' },
                        { icon: '🚫', title: 'No Data Selling', desc: 'We never sell your personal information to advertisers or third-party brokers.' },
                        { icon: '👁️', title: 'Transparency', desc: 'We are clear about what we collect and always give you control over your data.' },
                        { icon: '🗑️', title: 'Right to Delete', desc: 'You can request deletion of your account and associated data at any time.' },
                    ].map((item) => (
                        <div key={item.title} style={{
                            background: dark ? '#1f2937' : 'white',
                            border: `1px solid ${dark ? '#374151' : '#e5e7eb'}`,
                            borderRadius: '12px',
                            padding: '1.25rem',
                        }}>
                            <div style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>{item.icon}</div>
                            <p style={{ margin: '0 0 0.25rem', fontWeight: 700, fontSize: '0.9rem', color: dark ? '#f9fafb' : '#111827' }}>{item.title}</p>
                            <p style={{ margin: 0, fontSize: '0.8rem', color: dark ? '#9ca3af' : '#6b7280', lineHeight: '1.6' }}>{item.desc}</p>
                        </div>
                    ))}
                </div>

                {/* Table of Contents */}
                <div style={{
                    background: dark ? '#1f2937' : 'white',
                    border: `1px solid ${dark ? '#374151' : '#e5e7eb'}`,
                    borderRadius: '16px',
                    padding: '1.5rem 2rem',
                    marginBottom: '2.5rem',
                }}>
                    <p style={{ fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#00A699', marginBottom: '1rem' }}>
                        Table of Contents
                    </p>
                    <ol style={{ margin: 0, padding: '0 0 0 1.25rem', color: dark ? '#9ca3af' : '#6b7280', fontSize: '0.9rem', lineHeight: '2' }}>
                        {[
                            'Information We Collect',
                            'How We Use Your Information',
                            'Information Sharing',
                            'Cookies & Tracking Technologies',
                            'Data Retention',
                            'Your Rights & Choices',
                            'Children\'s Privacy',
                            'Third-Party Links',
                            'Security',
                            'International Data Transfers',
                            'Changes to This Policy',
                            'Contact Us',
                        ].map((item, i) => (
                            <li key={i}>{item}</li>
                        ))}
                    </ol>
                </div>

                {/* Sections */}
                <Section title="1. Information We Collect" dark={dark}>
                    <p><strong style={{ color: dark ? '#f9fafb' : '#111827' }}>Information you provide directly:</strong></p>
                    <ul style={{ marginTop: '0.4rem', paddingLeft: '1.25rem' }}>
                        <li>Account registration details (name, email address, password)</li>
                        <li>Profile information and photos you choose to upload</li>
                        <li>Listing content, reviews, messages, and other user-generated content</li>
                        <li>Payment and billing information (processed by our payment partner — we do not store full card numbers)</li>
                        <li>Identity verification documents (where required by law or policy)</li>
                    </ul>
                    <p style={{ marginTop: '0.75rem' }}><strong style={{ color: dark ? '#f9fafb' : '#111827' }}>Information collected automatically:</strong></p>
                    <ul style={{ marginTop: '0.4rem', paddingLeft: '1.25rem' }}>
                        <li>Log data (IP address, browser type, pages visited, timestamps)</li>
                        <li>Device information (operating system, unique device identifiers)</li>
                        <li>Location data (with your permission, for map features)</li>
                        <li>Cookies and similar tracking technologies (see Section 4)</li>
                    </ul>
                </Section>

                <Section title="2. How We Use Your Information" dark={dark}>
                    <p>We use the information we collect to:</p>
                    <ul style={{ marginTop: '0.5rem', paddingLeft: '1.25rem' }}>
                        <li>Provide, maintain, and improve the Wanderlust Platform</li>
                        <li>Process transactions and send related confirmations and receipts</li>
                        <li>Authenticate your identity and prevent fraud</li>
                        <li>Personalise your experience and surface relevant listings</li>
                        <li>Send service-related communications (e.g., booking confirmations, password resets)</li>
                        <li>Send promotional communications — you may opt out at any time</li>
                        <li>Respond to your enquiries and provide customer support</li>
                        <li>Comply with legal obligations and enforce our Terms of Service</li>
                    </ul>
                    <p style={{ marginTop: '0.75rem' }}>We rely on the following legal bases for processing: performance of a contract, legitimate interests, compliance with legal obligations, and your consent where required.</p>
                </Section>

                <Section title="3. Information Sharing" dark={dark}>
                    <p>We do not sell your personal data. We may share information in these limited circumstances:</p>
                    <ul style={{ marginTop: '0.5rem', paddingLeft: '1.25rem' }}>
                        <li><strong style={{ color: dark ? '#f9fafb' : '#111827' }}>Between Guests and Hosts:</strong> To facilitate bookings, limited profile information is shared between the parties to a transaction.</li>
                        <li><strong style={{ color: dark ? '#f9fafb' : '#111827' }}>Service providers:</strong> We engage trusted third parties (payment processors, cloud storage, analytics) who process data only on our behalf under strict confidentiality agreements.</li>
                        <li><strong style={{ color: dark ? '#f9fafb' : '#111827' }}>Legal requirements:</strong> We may disclose data if required by law, subpoena, or other governmental request, or to protect the rights, property, or safety of Wanderlust and its users.</li>
                        <li><strong style={{ color: dark ? '#f9fafb' : '#111827' }}>Business transfers:</strong> In the event of a merger, acquisition, or sale of assets, user data may be transferred as part of that transaction.</li>
                    </ul>
                </Section>

                <Section title="4. Cookies & Tracking Technologies" dark={dark}>
                    <p>We use cookies and similar technologies (web beacons, pixels) to:</p>
                    <ul style={{ marginTop: '0.5rem', paddingLeft: '1.25rem' }}>
                        <li>Keep you logged in across sessions</li>
                        <li>Remember your preferences (e.g., dark mode, currency)</li>
                        <li>Understand how users interact with our Platform (analytics)</li>
                        <li>Detect and prevent fraudulent activity</li>
                    </ul>
                    <p style={{ marginTop: '0.75rem' }}>You can control cookies through your browser settings. Disabling certain cookies may affect Platform functionality. We do not currently respond to Do Not Track signals.</p>
                </Section>

                <Section title="5. Data Retention" dark={dark}>
                    <p>We retain your personal data for as long as your account is active or as needed to provide you services. We may also retain data for legitimate business purposes such as fraud prevention, legal compliance, and dispute resolution.</p>
                    <p style={{ marginTop: '0.75rem' }}>When you delete your account, we will delete or anonymise your personal data within 30 days, except where we are legally required to retain it.</p>
                </Section>

                <Section title="6. Your Rights & Choices" dark={dark}>
                    <p>Depending on your jurisdiction, you may have the following rights regarding your personal data:</p>
                    <ul style={{ marginTop: '0.5rem', paddingLeft: '1.25rem' }}>
                        <li><strong style={{ color: dark ? '#f9fafb' : '#111827' }}>Access:</strong> Request a copy of the personal data we hold about you.</li>
                        <li><strong style={{ color: dark ? '#f9fafb' : '#111827' }}>Correction:</strong> Request correction of inaccurate or incomplete data.</li>
                        <li><strong style={{ color: dark ? '#f9fafb' : '#111827' }}>Deletion:</strong> Request deletion of your personal data ("right to be forgotten").</li>
                        <li><strong style={{ color: dark ? '#f9fafb' : '#111827' }}>Portability:</strong> Receive your data in a structured, machine-readable format.</li>
                        <li><strong style={{ color: dark ? '#f9fafb' : '#111827' }}>Objection:</strong> Object to processing based on legitimate interests.</li>
                        <li><strong style={{ color: dark ? '#f9fafb' : '#111827' }}>Opt out of marketing:</strong> Unsubscribe from promotional emails via the link in any email.</li>
                    </ul>
                    <p style={{ marginTop: '0.75rem' }}>To exercise any of these rights, contact us at <strong style={{ color: '#00A699' }}>privacy@wanderlust.com</strong>. We will respond within 30 days.</p>
                </Section>

                <Section title="7. Children's Privacy" dark={dark}>
                    <p>The Platform is not directed at children under the age of 13. We do not knowingly collect personal information from children under 13. If we become aware that we have collected such data, we will take steps to delete it promptly. If you believe a child has provided us personal information, please contact us immediately.</p>
                </Section>

                <Section title="8. Third-Party Links" dark={dark}>
                    <p>Our Platform may contain links to third-party websites or services. We are not responsible for the privacy practices of those third parties and encourage you to review their privacy policies before providing any personal information.</p>
                </Section>

                <Section title="9. Security" dark={dark}>
                    <p>We implement industry-standard technical and organisational security measures to protect your personal data against unauthorised access, alteration, disclosure, or destruction. These include:</p>
                    <ul style={{ marginTop: '0.5rem', paddingLeft: '1.25rem' }}>
                        <li>TLS/SSL encryption for all data transmitted over the network</li>
                        <li>Hashed and salted password storage</li>
                        <li>Role-based access controls for internal data access</li>
                        <li>Regular security audits and vulnerability assessments</li>
                    </ul>
                    <p style={{ marginTop: '0.75rem' }}>No method of transmission over the internet or electronic storage is 100% secure. We cannot guarantee absolute security but are committed to using best-in-class practices.</p>
                </Section>

                <Section title="10. International Data Transfers" dark={dark}>
                    <p>Wanderlust operates globally. Your information may be transferred to and processed in countries other than your own, including countries that may not have the same data protection laws. Where required, we implement appropriate safeguards (such as standard contractual clauses) to ensure adequate protection of your data.</p>
                </Section>

                <Section title="11. Changes to This Policy" dark={dark}>
                    <p>We may update this Privacy Policy from time to time. When we make material changes, we will notify you by email (at the address on file) and/or by prominently displaying a notice on our Platform before the change becomes effective. Your continued use of the Platform after the effective date constitutes acceptance of the updated Policy.</p>
                </Section>

                <Section title="12. Contact Us" dark={dark}>
                    <p>If you have any questions, concerns, or requests regarding this Privacy Policy or how we handle your data, please contact our Privacy team:</p>
                    <div style={{
                        marginTop: '1rem',
                        background: dark ? '#1f2937' : '#f0fdfb',
                        border: '1px solid #00A69922',
                        borderRadius: '12px',
                        padding: '1.25rem 1.5rem',
                    }}>
                        <p style={{ margin: 0, fontWeight: 600, color: dark ? '#f9fafb' : '#111827' }}>Wanderlust Privacy Team</p>
                        <p style={{ margin: '4px 0 0', color: '#00A699' }}>📧 privacy@wanderlust.com</p>
                        <p style={{ margin: '4px 0 0', color: dark ? '#9ca3af' : '#6b7280' }}>We respond within 30 days as required by applicable law.</p>
                    </div>
                </Section>

                {/* Footer links */}
                <div style={{
                    marginTop: '3rem', paddingTop: '2rem',
                    borderTop: `1px solid ${dark ? '#374151' : '#e5e7eb'}`,
                    display: 'flex', flexWrap: 'wrap', gap: '1rem',
                    justifyContent: 'space-between', alignItems: 'center',
                    paddingBottom: '3rem',
                }}>
                    <p style={{ margin: 0, color: dark ? '#6b7280' : '#9ca3af', fontSize: '0.8rem' }}>
                        © {new Date().getFullYear()} Wanderlust. All rights reserved.
                    </p>
                    <div style={{ display: 'flex', gap: '1.5rem' }}>
                        <Link to="/terms" style={{ fontSize: '0.875rem', color: '#FF385C', textDecoration: 'none', fontWeight: 600 }}>
                            Terms of Service
                        </Link>
                        <Link to="/" style={{ fontSize: '0.875rem', color: dark ? '#9ca3af' : '#6b7280', textDecoration: 'none' }}>
                            Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
