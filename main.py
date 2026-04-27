import boto3
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_ec2():
    return boto3.client(
        'ec2',
        endpoint_url='http://127.0.0.1:4566', 
        region_name='us-east-1',
        aws_access_key_id='test',
        aws_secret_access_key='test'
    )

@app.get("/api/dashboard")
def get_data():
    try:
        ec2 = get_ec2()
        response = ec2.describe_instances()
        all_ins = []
        waste = []
        for res in response.get('Reservations', []):
            for ins in res.get('Instances', []):
                if ins['State']['Name'] in ['running', 'pending']:
                    all_ins.append(ins)
                    if ins['InstanceType'] == 't3.large':
                        waste.append({"id": ins['InstanceId'], "text": f"Terminate Idle Instance ({ins['InstanceId']})"})
        return {
            "stats": {"total_nodes": len(all_ins), "waste_detected": len(waste), "money_saved": f"${len(waste) * 25}"},
            "recommendations": waste
        }
    except Exception as e:
        print(f"DASHBOARD ERROR: {e}")
        return {"stats": {"total_nodes": 0, "waste_detected": 0, "money_saved": "$0"}, "recommendations": []}

@app.post("/api/add-instance/{instance_type}")
def create_instance(instance_type: str):
    try:
        ec2 = get_ec2()
        ec2.run_instances(ImageId='ami-12345678', MinCount=1, MaxCount=1, InstanceType=instance_type)
        print(f"SUCCESS: Added {instance_type}")
        return {"success": True}
    except Exception as e:
        print(f"ADD INSTANCE ERROR: {e}")
        # Error ko string mein convert karke bhejein taake 'undefined' na aaye
        return {"success": False, "error": str(e)}

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)