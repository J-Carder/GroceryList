import Button from "./../Components/Button";
import logo from "../Assets/shoppingCartLogo.svg";

const Splash = ({setSplash}) => {
    return (
        <div className="bg-green h-screen flex flex-col justify-center">
            <img src={logo} alt="GroceryList logo" className="bg-white shadow-2xl px-3 py-8 max-w-full w-[150px] self-center rounded-xl" />
            <h1 className="text-white text-4xl bold text-center m-4">Welcome to the GroceryList App!</h1>
            <p className="italic text-white text-center text-xl">Manage groceries with ease</p>
            <Button onClick={() => setSplash(false)}>Let's start!</Button>
        </div>
    );
}

export default Splash;