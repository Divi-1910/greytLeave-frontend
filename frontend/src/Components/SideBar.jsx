import {ChevronLast, ChevronFirst, LogOut} from "lucide-react";
import {useContext, createContext, useState} from "react";
import {Link} from "react-router-dom";
import logo from "../assets/logo.jpg";

const SidebarContext = createContext();

export default function Sidebar({children}) {
	const [expanded, setExpanded] = useState(true);

	return (
		<aside
			className={`
      h-screen
      transition-all
      duration-300
      bg-white
      border-r
      border-gray-200
      relative
      ${expanded ? "w-72" : "w-20"}
    `}>
			<nav className="h-full flex flex-col">
				<div className="p-4 flex justify-between items-center border-b border-gray-100">
					<div className="flex items-center">
						<img
							src={logo}
							className={`
                rounded-lg
                transition-all
                duration-300
                ease-in-out
                ${expanded ? "w-36" : "w-0"}
              `}
							alt="Company Logo"
						/>
					</div>
					<button
						onClick={() => setExpanded((curr) => !curr)}
						className="
              p-2
              rounded-lg
              hover:bg-gray-100
              active:bg-gray-200
              transition-colors
              duration-200
              ease-in-out
            "
						aria-label="Toggle Sidebar"
						aria-expanded={expanded}>
						{expanded ? (
							<ChevronFirst className="w-5 h-5 text-gray-500" />
						) : (
							<ChevronLast className="w-5 h-5 text-gray-500" />
						)}
					</button>
				</div>

				<SidebarContext.Provider value={{expanded}}>
					<ul className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
						{children}
					</ul>
				</SidebarContext.Provider>

				<div className="border-t border-gray-100">
					<div
						className="
            p-4
            mx-3
            my-2
            flex
            items-center
            bg-gradient-to-r
            from-blue-500
            to-blue-600
            text-white
            rounded-xl
            transition-all
            duration-200
            hover:from-blue-600
            hover:to-blue-700
            group
          ">
						<img
							src="https://ui-avatars.com/api/?name=Admin&background=3b82f6&color=ffffff"
							alt="Admin Avatar"
							className="w-10 h-10 rounded-lg ring-2 ring-white/30"
						/>
						<div
							className={`
              flex
              justify-between
              items-center
              overflow-hidden
              transition-all
              duration-300
              ${expanded ? "w-52 ml-3" : "w-0"}
            `}>
							<div className="leading-4">
								<h4 className="font-semibold">Admin</h4>
								<p className="text-xs text-blue-100">System Administrator</p>
							</div>
							<LogOut
								className="
                w-5
                h-5
                ml-auto
                cursor-pointer
                opacity-75
                hover:opacity-100
                transition-opacity
                duration-200
              "
							/>
						</div>
					</div>
				</div>
			</nav>
		</aside>
	);
}

export function SidebarItem({icon, text, active, alert, to}) {
	const {expanded} = useContext(SidebarContext);

	return (
		<li>
			<Link
				to={to}
				className={`
          relative
          flex
          items-center
          py-3
          px-3
          my-1
          font-medium
          rounded-xl
          cursor-pointer
          transition-all
          duration-200
          group
          ${
						active
							? "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600"
							: "hover:bg-gray-50 text-gray-600 hover:text-blue-600"
					}
        `}>
				<span
					className={`
          transition-colors
          duration-200
          ${
						active ? "text-blue-600" : "text-gray-500 group-hover:text-blue-500"
					}
        `}>
					{icon}
				</span>

				<span
					className={`
          overflow-hidden
          transition-all
          duration-300
          ${expanded ? "w-52 ml-3" : "w-0"}
          ${active ? "font-semibold" : ""}
        `}>
					{text}
				</span>

				{alert && (
					<div
						className={`
            absolute
            right-2
            w-2
            h-2
            rounded-full
            bg-blue-400
            ring-4
            ring-blue-100
            ${expanded ? "" : "top-2"}
          `}
					/>
				)}
			</Link>

			{!expanded && (
				<div
					className={`
          absolute
          left-full
          rounded-md
          px-4
          py-2
          ml-6
          bg-gray-900
          text-white
          text-sm
          invisible
          opacity-0
          -translate-x-3
          group-hover:visible
          group-hover:opacity-100
          group-hover:translate-x-0
          transition-all
          duration-300
          z-50
        `}>
					{text}
				</div>
			)}
		</li>
	);
}
