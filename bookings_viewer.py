import time
import os
import csv
import requests
from datetime import datetime

CSV_FILE = "home_inspection_bookings.csv"
POLL_INTERVAL = 60  # seconds
UPSTASH_URL = "https://genuine-minnow-62047.upstash.io"
UPSTASH_TOKEN = "AfJfAAIncDFmMmEyMDNhNDQzYTk0ZWMwYTQ5YzFkODM2NjM2OTFmZHAxNjIwNDc"

class BookingExporter:
    def __init__(self):
        self.base_url = UPSTASH_URL
        self.headers = {
            "Authorization": f"Bearer {UPSTASH_TOKEN}",
            "Content-Type": "application/json"
        }

    def redis_command(self, command):
        try:
            response = requests.post(self.base_url, headers=self.headers, json=command)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            print(f"❌ Redis command failed: {e}")
            return None

    def get_booking_ids(self):
        result = self.redis_command(["LRANGE", "bookings:list", "0", "-1"])
        return result.get("result", []) if result else []

    def get_booking_details(self, booking_id):
        result = self.redis_command(["HGETALL", f"booking:{booking_id}"])
        if result and "result" in result:
            flat_list = result["result"]
            return {flat_list[i]: flat_list[i+1] for i in range(0, len(flat_list), 2)}
        return None

    def load_existing_csv(self):
        bookings = {}
        if not os.path.exists(CSV_FILE):
            return bookings
        with open(CSV_FILE, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                bookings[row['Booking ID']] = row
        return bookings

    def write_csv(self, all_bookings):
        headers = [
            'Booking ID', 'Name', 'Phone', 'Email', 'Address',
            'Property Type', 'Inspection Date', 'Created At', 'Status'
        ]
        with open(CSV_FILE, 'w', newline='', encoding='utf-8') as f:
            writer = csv.DictWriter(f, fieldnames=headers)
            writer.writeheader()
            for booking in all_bookings.values():
                writer.writerow(booking)

    def sync_changes(self):
        print(f"\n🔄 Syncing at {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        booking_ids = self.get_booking_ids()
        if not booking_ids:
            print("⚠️ No booking IDs found.")
            return

        existing_csv_data = self.load_existing_csv()
        updated_data = existing_csv_data.copy()

        for booking_id in booking_ids:
            booking = self.get_booking_details(booking_id)
            if not booking:
                continue

            # Format date
            created_at = booking.get("createdAt", "")
            try:
                dt = datetime.fromisoformat(created_at.replace("Z", "+00:00"))
                created_at_str = dt.strftime('%Y-%m-%d %H:%M:%S')
            except:
                created_at_str = created_at

            new_row = {
                'Booking ID': booking.get('id', ''),
                'Name': booking.get('name', ''),
                'Phone': booking.get('phone', ''),
                'Email': booking.get('email', ''),
                'Address': booking.get('address', ''),
                'Property Type': booking.get('propertyType', ''),
                'Inspection Date': booking.get('inspectionDate', ''),
                'Created At': created_at_str,
                'Status': booking.get('status', '')
            }

            existing_row = existing_csv_data.get(booking_id)
            if not existing_row or existing_row != new_row:
                action = "🆕 Added" if not existing_row else "✏️ Updated"
                print(f"{action} booking ID: {booking_id}")
                updated_data[booking_id] = new_row

        self.write_csv(updated_data)
        print(f"✅ Sync complete. Total bookings now: {len(updated_data)}")

def main():
    print("📡 Watching for booking updates... (Press Ctrl+C to stop)")
    exporter = BookingExporter()
    try:
        while True:
            exporter.sync_changes()
            time.sleep(POLL_INTERVAL)
    except KeyboardInterrupt:
        print("\n👋 Stopped watching.")

if __name__ == "__main__":
    main()
