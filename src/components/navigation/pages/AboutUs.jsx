import React from "react";

export default function AboutUs() {

    return (
        <div style={{ padding: "2rem", display: "flex", justifyContent: "center" }}>
            <div style={{ width: "100%", maxWidth: 1400 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "1fr 1fr", gap: "2rem", minHeight: "75vh" }}>
                    {/* Top-left: About OnTrack */}
                    <section style={{ padding: "1.5rem", borderRadius: 8, background: "#6ca6cb", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
                        <div style={{ fontFamily: "var(--font-logo)", fontSize: "2rem", marginBottom: "1rem" }}>
                            <span style={{ color: "var(--color-text)" }}>On</span>
                            <span style={{ color: "var(--color-background)" }}>Track</span>
                        </div>
                        <p style={{ lineHeight: 1.6, color: "var(--color-text)" }}>
                            This website is intended as a task management and study helper. Input your tasks and keep track of your progress
                        </p>
                        <p style={{ color: "var(--color-text)" }}> 
                            Tasks are organized into tabs. Each tab can represent a different class, project, or category of tasks, it's up to you! After making tabs, you can add your tasks and move them around.
                        </p>
                        <p style={{ color: "var(--color-text)" }}>Note: you must be logged in to create tasks.</p>
                    </section>

                    {/* Top-right: Pages */}
                    <section style={{ padding: "1.5rem", borderRadius: 8, background: "#569245", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
                        <h2 style={{ marginTop: 0, color: "var(--color-text)" }}>Pages</h2>
                            <p style={{ color: "var(--color-text)" }}><b>Home:</b> Create and organize your tasks.</p>
                            <p style={{ color: "var(--color-text)" }}><b>Weekly Calendar:</b> View tasks by week.</p>
                            <p style={{ color: "var(--color-text)" }}><b>Study Session:</b> Start focused study sessions.</p>
                            <p style={{ color: "var(--color-text)" }}><b>Profile:</b> Manage account info and view monthly activity.</p>
                    </section>

                    {/* Bottom-left: Our Team */}
                    <section style={{ padding: "1.5rem", borderRadius: 8, background: "#e19c56", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
                        <h2 style={{ marginTop: 0, color: "var(--color-text)" }}>Our Team</h2>
                            <p style={{ color: "var(--color-text)" }}><b>Annaliese:</b> I'm a senior studying computer science with a minor in data science. I love listening to music, baking, and doing crafts! </p>
                            <p style={{ color: "var(--color-text)" }}><b>Hudson:</b> I'm a junior studying computer science and i'm in the UW Marching Band. I love movies, music, and sports</p>                    
                    </section>

                    {/* Bottom-right: Resources */}
                    <section style={{ padding: "1.5rem", borderRadius: 8, background: "#8958a1", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
                        <h2 style={{ marginTop: 0, color: "var(--color-text)" }}>Resources</h2>
                        <p style={{ color: "var(--color-text)" }}>
                            Button Icons From: https://icons.getbootstrap.com/
                        </p>
                    </section>
                </div>
            </div>
        </div>
    )
}