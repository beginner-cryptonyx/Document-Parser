import UploadFile from "./components/UploadFile";
import { useState } from "react";

export default function App() {
	const [health, setHeath] = useState<"Healthy" | "Unhealthy" | "Unknown">(
		"Unknown",
	);
	async function checkHealth() {
		const req = await fetch("/api/health");
    if (!req.ok){
      setHeath("Unhealthy")
    }else{
      setHeath("Healthy")
    }
	}

	return (
		<div>
			<button onClick={checkHealth}>check health</button>
			<p>Health: {health}</p>
			<UploadFile />
		</div>
	);
}
