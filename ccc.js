import cluster from 'cluster'

export function startCluster(services, onUpdateWorkers) {
	function startWorker(service) {
		const worker = cluster.fork({ SERVICE_SCRIPT: service.script, SERVICE_NAME: service.name })
		console.log(`[${service.name}] Worker ${worker.process.pid} started`)

		worker.on('exit', (code, signal) => {
			console.log(`[${service.name}] Worker ${worker.process.pid} exited (code=${code}, signal=${signal})`)
			console.log(`[${service.name}] Restarting worker...`)
			startWorker(service)
		})

		return worker
	}

	if (cluster.isPrimary) {
		console.log(`[master] Master process ${process.pid} running`)
		services.forEach(service => startWorker(service))

		if (onUpdateWorkers) {
			onUpdateWorkers(() => {
				console.log('[master] Reloading all workers due to git update...')
				for (const id in cluster.workers) {
					cluster.workers[id].kill()
				}
			})
		}
	}
	else {
		const serviceScript = process.env.SERVICE_SCRIPT
		const serviceName = process.env.SERVICE_NAME

		console.log(`[${serviceName}] Worker ${process.pid} running script: ${serviceScript}`)

		import(`./${serviceScript}`).catch(err => {
			console.error(`[${serviceName}] Failed to import ${serviceScript}:`, err)
			process.exit(1)
		})
	}
}
