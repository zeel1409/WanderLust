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
            borderBottom: `2px solid #FF385C`,
            display: 'inline-block',
        }}>
            {title}
        </h2>
        <div style={{ color: dark ? '#d1d5db' : '#4b5563', lineHeight: '1.8', fontSize: '0.95rem' }}>
            {children}
        </div>
    </section>
);

const TermsOfService = () => {
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
                <span style={{ color: dark ? '#6b7280' : '#9ca3af', fontSize: '0.85rem' }}>/ Terms of Service</span>
            </div>

            {/* Hero banner */}
            <div style={{
                background: 'linear-gradient(135deg, #FF385C 0%, #E31C5F 60%, #c00f52 100%)',
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
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                </div>
                <h1 style={{ fontSize: 'clamp(2rem, 5vw, 2.75rem)', fontWeight: 800, margin: '0 0 0.75rem' }}>
                    Terms of Service
                </h1>
                <p style={{ fontSize: '1rem', opacity: 0.85, maxWidth: '520px', margin: '0 auto' }}>
                    Please read these terms carefully before using Wanderlust. They govern your access to and use of our platform.
                </p>
                <p style={{ marginTop: '1.25rem', fontSize: '0.8rem', opacity: 0.65 }}>
                    Last updated: April 29, 2026 · Effective immediately
                </p>
            </div>

            {/* Table of Contents */}
            <div style={{ maxWidth: '860px', margin: '0 auto', padding: '2.5rem 2rem 0' }}>
                <div style={{
                    background: dark ? '#1f2937' : 'white',
                    border: `1px solid ${dark ? '#374151' : '#e5e7eb'}`,
                    borderRadius: '16px',
                    padding: '1.5rem 2rem',
                    marginBottom: '2.5rem',
                }}>
                    <p style={{ fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#FF385C', marginBottom: '1rem' }}>
                        Table of Contents
                    </p>
                    <ol style={{ margin: 0, padding: '0 0 0 1.25rem', color: dark ? '#9ca3af' : '#6b7280', fontSize: '0.9rem', lineHeight: '2' }}>
                        {[
                            'Acceptance of Terms',
                            'Use of the Platform',
                            'User Accounts',
                            'Listings & Bookings',
                            'Payments & Fees',
                            'User-Generated Content',
                            'Prohibited Conduct',
                            'Intellectual Property',
                            'Limitation of Liability',
                            'Termination',
                            'Governing Law',
                            'Contact Us',
                        ].map((item, i) => (
                            <li key={i}>{item}</li>
                        ))}
                    </ol>
                </div>

                {/* Sections */}
                <Section title="1. Acceptance of Terms" dark={dark}>
                    <p>By accessing or using Wanderlust ("the Platform", "we", "us", or "our"), you confirm that you are at least 18 years of age, have read and understood these Terms, and agree to be bound by them. If you do not agree, please discontinue use of the Platform immediately.</p>
                    <p style={{ marginTop: '0.75rem' }}>These Terms apply to all visitors, users, hosts, and others who access or use the Platform. We may update these Terms from time to time; continued use after changes constitutes acceptance of the revised Terms.</p>
                </Section>

                <Section title="2. Use of the Platform" dark={dark}>
                    <p>Wanderlust provides an online marketplace connecting travellers ("Guests") with hosts who list accommodation and experiences ("Hosts"). We are not a party to any agreement between Guests and Hosts and do not own, operate, or control any listed property.</p>
                    <p style={{ marginTop: '0.75rem' }}>You agree to use the Platform only for lawful purposes and in accordance with these Terms. You must not use the Platform in any way that is unlawful, fraudulent, or harmful to other users.</p>
                </Section>

                <Section title="3. User Accounts" dark={dark}>
                    <p>To access certain features you must create an account. You are responsible for:</p>
                    <ul style={{ marginTop: '0.5rem', paddingLeft: '1.25rem' }}>
                        <li>Providing accurate, current, and complete registration information.</li>
                        <li>Maintaining the confidentiality of your password and account credentials.</li>
                        <li>All activities that occur under your account.</li>
                        <li>Notifying us immediately of any unauthorized use of your account.</li>
                    </ul>
                    <p style={{ marginTop: '0.75rem' }}>We reserve the right to suspend or terminate accounts that violate these Terms or that we believe pose a risk to the Platform or other users.</p>
                </Section>

                <Section title="4. Listings & Bookings" dark={dark}>
                    <p>Hosts are solely responsible for their listings, including accuracy of descriptions, pricing, availability, and compliance with all applicable laws, regulations, and local ordinances (including rental permits and tax obligations).</p>
                    <p style={{ marginTop: '0.75rem' }}>Wanderlust does not guarantee the accuracy of listing content. Guests should conduct their own due diligence before making a booking. All bookings constitute a direct contract between the Guest and Host.</p>
                </Section>

                <Section title="5. Payments & Fees" dark={dark}>
                    <p>Wanderlust may charge service fees to Guests and/or Hosts. All applicable fees are disclosed at the time of booking. Payments are processed securely by our third-party payment partners.</p>
                    <p style={{ marginTop: '0.75rem' }}>Refunds and cancellations are governed by the Host's stated cancellation policy. In cases of dispute, Wanderlust may facilitate but is not obligated to resolve financial disagreements between Guests and Hosts.</p>
                </Section>

                <Section title="6. User-Generated Content" dark={dark}>
                    <p>By submitting content (listings, reviews, photos, messages) to the Platform, you grant Wanderlust a worldwide, non-exclusive, royalty-free licence to use, reproduce, display, and distribute that content for the purpose of operating and promoting the Platform.</p>
                    <p style={{ marginTop: '0.75rem' }}>You represent that you own or have the necessary rights to submit any content, and that it does not infringe any third-party intellectual property, privacy, or publicity rights.</p>
                </Section>

                <Section title="7. Prohibited Conduct" dark={dark}>
                    <p>You must not:</p>
                    <ul style={{ marginTop: '0.5rem', paddingLeft: '1.25rem' }}>
                        <li>Post false, misleading, or fraudulent listings or reviews.</li>
                        <li>Use the Platform to harass, threaten, or discriminate against any person.</li>
                        <li>Scrape, crawl, or use automated means to access the Platform without our written consent.</li>
                        <li>Circumvent any security or access-control measures on the Platform.</li>
                        <li>Use the Platform in violation of any applicable law or regulation.</li>
                    </ul>
                </Section>

                <Section title="8. Intellectual Property" dark={dark}>
                    <p>The Wanderlust name, logo, and all Platform content (excluding user-generated content) are the intellectual property of Wanderlust and are protected by copyright, trademark, and other applicable laws. You may not copy, modify, or distribute Platform content without our express written permission.</p>
                </Section>

                <Section title="9. Limitation of Liability" dark={dark}>
                    <p>To the maximum extent permitted by applicable law, Wanderlust and its affiliates, officers, employees, agents, partners, and licensors shall not be liable for any indirect, incidental, special, consequential, or punitive damages — including loss of profits, data, goodwill, or other intangible losses — arising out of your access to or use of (or inability to access or use) the Platform.</p>
                    <p style={{ marginTop: '0.75rem' }}>Our total aggregate liability for any claims relating to the Platform shall not exceed the greater of USD $100 or the amounts paid by you to Wanderlust in the twelve months preceding the claim.</p>
                </Section>

                <Section title="10. Termination" dark={dark}>
                    <p>We may suspend or terminate your access to the Platform at our sole discretion, with or without notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties, or for any other reason.</p>
                    <p style={{ marginTop: '0.75rem' }}>You may terminate your account at any time by contacting us. Termination does not relieve you of obligations incurred prior to termination.</p>
                </Section>

                <Section title="11. Governing Law" dark={dark}>
                    <p>These Terms are governed by and construed in accordance with the laws of India. Any disputes arising under or in connection with these Terms shall be subject to the exclusive jurisdiction of the courts located in India, without regard to conflict of law principles.</p>
                </Section>

                <Section title="12. Contact Us" dark={dark}>
                    <p>If you have questions or concerns about these Terms, please reach out to us:</p>
                    <div style={{
                        marginTop: '1rem',
                        background: dark ? '#1f2937' : '#fff5f6',
                        border: '1px solid #FF385C22',
                        borderRadius: '12px',
                        padding: '1.25rem 1.5rem',
                    }}>
                        <p style={{ margin: 0, fontWeight: 600, color: dark ? '#f9fafb' : '#111827' }}>Wanderlust Support</p>
                        <p style={{ margin: '4px 0 0', color: '#FF385C' }}>📧 legal@wanderlust.com</p>
                        <p style={{ margin: '4px 0 0', color: dark ? '#9ca3af' : '#6b7280' }}>We respond within 2–3 business days.</p>
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
                        <Link to="/privacy" style={{ fontSize: '0.875rem', color: '#FF385C', textDecoration: 'none', fontWeight: 600 }}>
                            Privacy Policy
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

export default TermsOfService;
