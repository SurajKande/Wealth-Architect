# Wealth Architect 🏦

**Wealth Architect** is a personalized, AI-driven financial goal planner designed specifically for the **Indian market**. It helps users bridge the gap between their financial dreams and reality by providing mathematically rigorous, inflation-adjusted investment strategies.

---

## 🎯 Project Goal
The primary objective of Wealth Architect is to give users clarity on their financial future. Unlike simple SIP calculators, this tool acts as a **Financial GPS**:
1.  **Quantifies Goals**: Takes fuzzy goals (e.g., "Retirement in 2040") and converts them into precise numbers using inflation data.
2.  **Risk Profiling**: Automatically determines the safest yet most effective asset class (Equity, Debt, Hybrid) based on the time horizon.
3.  **Scenario Planning**: Offers interactive **Alternative Investment Strategies** (Conservative, Balanced, Aggressive) so users can trade off risk vs. contribution.
4.  **Real-World Data**: Integrates with **MFAPI.in** to fetch historical return rates (CAGR) for authentic projections.

---

## 🚀 Key Features
*   **Intelligent Recommendation Engine**: Automatically suggests funds (e.g., Liquid Funds for short term, Flexi Cap for long term) based on goal duration.
*   **Inflation Adjustment**: Calculates the *future cost* of goals to ensure users save enough purchasing power.
*   **Interactive Scenarios**: Clickable cards to toggle between Conservative, Balanced, and Aggressive strategies, instantly updating all corpus and SIP projections.
*   **Smart Formatting**: Displays currency in **Lakhs (L) and Crores (Cr)** for better readability in the Indian context.
*   **Precision Tools**: Granular control over parameters like monthly budget input (1-rupee precision).
*   **Premium UX**: Glassmorphism design, smooth transitions, and responsive data visualizations.

---

## 🛠️ Tech Stack
*   **Frontend**: React.js (Vite)
*   **Styling**: Tailwind CSS (Custom Dark Mode & Gradients)
*   **Icons**: Lucide React
*   **API**: [MFAPI.in](https://www.mfapi.in/) (for historical Mutual Fund NAV data)

---

## 📜 Version History & Changelog

### v2.0: The Wealth Platform (Current)
*   **Feature**: **Specific Fund Recommendations**. The engine now suggests real-world funds (e.g., *Parag Parikh Flexi Cap*, *SBI Liquid Fund*) with direct ISIN tracking links, instead of just generic categories.
*   **Data**: Integration with **Kuvera / AMFI** datasets to map categories to top-performing Direct Growth funds.

### v1.4: UX & Interactivity Polish
*   **Feature**: Added **Interactive Alternative Scenarios**. Users can now click on "Conservative" or "Aggressive" cards to swap the entire recommendation logic dynamically.
*   **UX**: Highlighted active strategies with a "selected" state (border + glow).
*   **UX**: **Smart Date Defaults**. Start Date now defaults to today and resets automatically after adding a goal.
*   **UX**: Improved **Budget Slider** precision from ₹1000 steps to ₹1 steps for fine-tuning.

### v1.3: Indian Localization & Real Data
*   **Feature**: Integrated **MFAPI** to fetch real 1-year historical CAGR for key index funds to ground assumptions in reality.
*   **Feature**: Implemented **Smart Currency Formatter** function `formatCurrency()` to display huge numbers as reasonable "1.5 Cr" or "8.5 L" instead of "1,50,00,000".

### v1.2: The Recommendation Engine
*   **Core Logic**: Built the `useFinancialAdvisor` hook.
*   **Algorithm**: Implemented logic to check "Feasibility". If a goal is achievable with current savings, it flags it. If not, it calculates the **Extra SIP** needed.
*   **Asset Classes**: Defined standard categories (Liquid, Arbitrage, Equity Savings, Aggressive Hybrid, Flexi Cap) with associated risk profiles and default return expectations.

### v1.1: UI/Visual Overhaul
*   **Design**: Shifted to a "Dark Profile" aesthetic with deep slate backgrounds, emerald accents, and glassmorphism cards.
*   **Layout**: Split interface into "Goal Input" (Left) and "Smart Dashboard" (Right).

### v1.0: MVP (Minimum Viable Product)
*   **Basic Setup**: Project initialization with Vite + Tailwind.
*   **Functionality**: Simple form to input Goal Name, Target Date, and Cost.
*   **Math**: Basic Future Value (FV) and SIP formulas implemented.

---

## 🚀 Getting Started

1.  **Clone the repository**
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Run locally**:
    ```bash
    npm run dev
    ```
4.  Open `http://localhost:5173` to start planning your wealth!
