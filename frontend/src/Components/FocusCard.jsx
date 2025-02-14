import React from "react";
import {Card} from "./Card";
import Logo from "../assets/logo.jpg";
import {motion} from "framer-motion";

export function FocusCards({countries}) {
	const [hovered, setHovered] = React.useState(null);

	const containerVariants = {
		hidden: {opacity: 0},
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1,
			},
		},
	};

	return (
		<section className="py-16 px-4 bg-gradient-to-br from-gray-50 to-gray-100">
			<motion.div
				initial="hidden"
				animate="visible"
				variants={containerVariants}
				className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 
                   gap-8 max-w-7xl mx-auto w-full relative">
				{countries.map((country, index) => (
					<motion.div
						key={country.id}
						variants={{
							hidden: {opacity: 0, y: 20},
							visible: {opacity: 1, y: 0},
						}}
						whileHover={{y: -5}}
						transition={{duration: 0.3}}
						className="transform transition-all duration-300">
						<Card
							card={{
								title: country.title,
								src: Logo,
								details: (
									<div className="flex items-center justify-between text-gray-600">
										<span className="flex items-center">
											<svg
												className="w-4 h-4 mr-2"
												fill="currentColor"
												viewBox="0 0 20 20">
												<path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
											</svg>
											{country.employeeCount} Employees
										</span>
										<span className="flex items-center">
											<svg
												className="w-4 h-4 mr-2"
												fill="currentColor"
												viewBox="0 0 20 20">
												<path d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" />
											</svg>
											{country.holidayCount} Holidays
										</span>
									</div>
								),
							}}
							index={index}
							hovered={hovered}
							setHovered={setHovered}
							countryId={country.id}
						/>
					</motion.div>
				))}
			</motion.div>
		</section>
	);
}
