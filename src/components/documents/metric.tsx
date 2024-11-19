import {useElementSize} from "@/hooks/use-element-size";
import {useMedia} from "@/hooks/use-media";
import {useEffect,useState} from "react";
import {ResponsiveContainer,PieChart,Pie,Cell} from "recharts";

const MetricInfo = ({metric}: {metric: any}) => {
	console.log("MetricInfo:",metric);

	// Tamaño del gráfico y dimensiones responsivas
	const [chartRef,{width}] = useElementSize();
	const isMobile = useMedia("(max-width: 639px)",false);
	const isManager = useMedia("(min-width: 1536px)",false);

	const config = {
		cx: width / 2,
		cy: 200,
		iR: isMobile ? 80 : isManager ? 100 : 130,
		oR: isMobile ? 100 : isManager ? 120 : 150,
	};

	// Estado inicial de los datos del gráfico
	const [chartData,setChartData] = useState([
		{
			name: "Registrados",
			value: 0,
			color: "#15284b",
			count: 0,
			percentage: 0,
		},
		{
			name: "Restante",
			value: 0,
			color: "#E5E7EB",
			count: 0,
			percentage: 100,
		},
	]);

	useEffect(() => {
		// Validar que `metric` contenga los datos esperados
		if (metric) {
			const {totalRequired,documents,missingDocuments,documentPercentage} = metric;

			// Cálculo de los datos
			const registered = documents.length;
			const missing = missingDocuments.length;

			// Actualizar los datos del gráfico
			setChartData([
				{
					name: "Registrados",
					value: registered,
					color: "#15284b",
					count: registered,
					percentage: Math.round(documentPercentage), // Porcentaje de documentos registrados
				},
				{
					name: "Restante",
					value: missing,
					color: "#E5E7EB",
					count: missing,
					percentage: Math.round(100 - documentPercentage), // Porcentaje de documentos restantes
				},
			]);
		}
	},[metric]);

	return (
		<div className="rounded-[12px] p-5 border border-gray-100 bg-white min-w-full">
			<div className="flex justify-center items-center">
				<div ref={chartRef} className="relative h-60 w-full sm:h-64 md:h-72">
					<ResponsiveContainer width="100%" height="100%">
						<PieChart className="relative [&>.recharts-surface]:mx-auto [&>.recharts-surface]:max-w-md [&>.recharts-surface]:md:max-w-none">
							<Pie
								data={chartData}
								endAngle={-10}
								stroke="none"
								cx={config.cx}
								cy={config.cy}
								startAngle={190}
								paddingAngle={1}
								cornerRadius={12}
								dataKey="percentage"
								innerRadius={config.iR}
								outerRadius={config.oR}
							>
								{chartData.map((entry,index) => (
									<Cell key={`cell-${index}`} fill={entry.color} />
								))}
							</Pie>
						</PieChart>
					</ResponsiveContainer>

					<div className="absolute bottom-0 start-1/2 -translate-x-1/2 ps-2 text-center sm:-translate-y-full">
						<p className="text-2xl font-bold text-gray-800 @2xl:text-4xl">
							{`${chartData[1]?.percentage}% Restante`}
						</p>
					</div>
				</div>
			</div>

			{/* Meta y restante */}
			<div className="flex justify-between mt-4">
				<div className="text-left">
					<p className="text-gray-500">Documentos registrados</p>
					<p className="text-lg font-semibold">{chartData[0]?.count}</p>
				</div>
				<div className="text-right">
					<p className="text-red-500">Documentos restantes</p>
					<p className="text-lg font-semibold">{chartData[1]?.count}</p>
				</div>
			</div>
		</div>
	);
};

export default MetricInfo;
