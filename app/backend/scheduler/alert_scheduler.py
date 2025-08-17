from apscheduler.schedulers.background import BackgroundScheduler
from alerts.alert_processor import process_alerts
import asyncio

def start_alert_scheduler():
    scheduler = BackgroundScheduler()

    # Führe alle 10 Minuten den Prozess aus
    scheduler.add_job(lambda: asyncio.run(process_alerts()), 'interval', minutes=10)

    scheduler.start()
    print("Alert Scheduler gestartet")