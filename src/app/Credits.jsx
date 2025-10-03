import Navbar from "./components/Navbar";   
import UserGoldLevelBar from "./components/UserGoldLevelBar";
import PageWrapper from "./components/PageWrapper";
import "./globals.css";

export default function Credits({gold, level, exp, resetXp, addLevel}) {
    return (
        <PageWrapper loadingType="app">
            <div className="credits-page">
                <Navbar />
                <UserGoldLevelBar gold={gold} level={level} exp={exp} resetXp={resetXp} addLevel={addLevel} />
                <div className="credits-content">
                    <h1>Credits Page</h1>
                    <p>Meet the team behind the game and see special thanks.</p>
                </div>
            </div>
        </PageWrapper>
    );
}