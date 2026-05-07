import Link from "next/link";
import styles from "./page.module.css";
import { FaUtensils, FaBook, FaBalanceScale } from "react-icons/fa";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.header}>
          <h1 className={styles.title}>
            <span className="gradient-text">AI Culinary Chef</span>
          </h1>
          <p className={styles.subtitle} style={{ letterSpacing: "0.5px", fontWeight: "300" }}>
            Your personalized, intelligent cooking assistant.
          </p>
        </div>

        <div className={styles.contentArea} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "2rem", marginTop: "2rem" }}>
          
          <Link href="/generator" className="glass-panel nav-card" style={{ padding: "3rem 2rem", textDecoration: "none", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
            <div style={{ marginBottom: "1.5rem", color: "var(--foreground)" }}>
              <FaUtensils size={48} />
            </div>
            <h2 style={{ color: "var(--foreground)", marginBottom: "0.75rem", fontSize: "1.35rem", fontWeight: "600", letterSpacing: "-0.5px" }}>Recipe Generator</h2>
            <p style={{ color: "var(--secondary)", fontSize: "0.95rem", lineHeight: "1.5" }}>Create custom recipes based on what&apos;s in your kitchen.</p>
          </Link>

          <Link href="/saved" className="glass-panel nav-card" style={{ padding: "3rem 2rem", textDecoration: "none", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
            <div style={{ marginBottom: "1.5rem", color: "var(--foreground)" }}>
              <FaBook size={48} />
            </div>
            <h2 style={{ color: "var(--foreground)", marginBottom: "0.75rem", fontSize: "1.35rem", fontWeight: "600", letterSpacing: "-0.5px" }}>Saved Recipes</h2>
            <p style={{ color: "var(--secondary)", fontSize: "0.95rem", lineHeight: "1.5" }}>Access your personal collection of culinary masterpieces.</p>
          </Link>

          <Link href="/tools" className="glass-panel nav-card" style={{ padding: "3rem 2rem", textDecoration: "none", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
            <div style={{ marginBottom: "1.5rem", color: "var(--foreground)" }}>
              <FaBalanceScale size={48} />
            </div>
            <h2 style={{ color: "var(--foreground)", marginBottom: "0.75rem", fontSize: "1.35rem", fontWeight: "600", letterSpacing: "-0.5px" }}>Utility Tools</h2>
            <p style={{ color: "var(--secondary)", fontSize: "0.95rem", lineHeight: "1.5" }}>Convert measurements and find ingredient substitutes.</p>
          </Link>

        </div>
      </main>
    </div>
  );
}
