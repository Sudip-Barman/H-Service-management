import "./LandingPage.css";

function LandingPage(){

    return (
        <div className="container">
            <div className="navbar">
                <div className="left-navbar">
                    <img src="../src/assets/logo-2.webp" alt="Logo" />
                </div>
                <div className="right-navbar">
                    <a href="">HOME</a>
                    <a href="">ABOUT</a>
                    <a href="">SERVICES</a>
                    <a href="">GALLARY</a>
                    <a href="">CERTIFICATES</a>
                </div>
            </div>
        </div>
    );
}

export default LandingPage;