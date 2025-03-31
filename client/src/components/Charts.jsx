import React from "react";
import { motion } from "framer-motion";
import {
	BarChart,
	Bar,
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
} from "recharts";

const Charts = ({ dailySalesData }) => {
	return (
		<div className="bag-gray-100 p-6 flex-1 space-y-6">
			{/* Daily Sales Trend */}
			<motion.div
				className="bg-white rounded-lg shadow p-6"
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
			>
				<h2 className="text-lg font-semibold mb-4">Daily Sales Trend</h2>
				<div className="h-80">
					<ResponsiveContainer width="100%" height="100%">
						<LineChart data={dailySalesData}>
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis dataKey="date" />
							<YAxis />
							<Tooltip />
							<Legend />
							<Line
								type="monotone"
								dataKey="sales"
								stroke="#4F46E5"
								strokeWidth={2}
								name="Sales"
							/>
							<Line
								type="monotone"
								dataKey="revenue"
								stroke="#22C55E"
								strokeWidth={2}
								name="Revenue"
							/>
						</LineChart>
					</ResponsiveContainer>
				</div>
			</motion.div>
		</div>
	);
};

export default Charts;
