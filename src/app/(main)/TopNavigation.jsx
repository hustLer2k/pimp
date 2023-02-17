import {
	FaHashtag,
	FaRegBell,
	FaUserCircle,
	FaMoon,
	FaSun,
} from "react-icons/fa";
import Search from "./Search";

const TopNavigation = () => {
	return (
		<div className="top-navigation">
			<HashtagIcon />
			<Title />
			<ThemeIcon />
			<Search />
			<BellIcon />
			<UserCircle />
		</div>
	);
};

const ThemeIcon = () => {
	// const [darkTheme, setDarkTheme] = useDarkMode();
	// const handleMode = () => setDarkTheme(!darkTheme);
	const darkTheme = false;
	return (
		<span>
			{darkTheme ? (
				<FaSun size="24" className="top-navigation-icon" />
			) : (
				<FaMoon size="24" className="top-navigation-icon" />
			)}
		</span>
	);
};

const BellIcon = () => <FaRegBell size="24" className="top-navigation-icon" />;
const UserCircle = () => (
	<FaUserCircle size="24" className="top-navigation-icon" />
);
const HashtagIcon = () => <FaHashtag size="20" className="title-hashtag" />;
const Title = () => <h5 className="title-text">Pimp</h5>;

export default TopNavigation;
