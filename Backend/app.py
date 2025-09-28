from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime, timezone, timedelta
import uuid, jwt
import bcrypt

app = Flask(__name__)
SECRET_KEY = "RESOLVEONEXADMINTURNNOTPASS"
CORS(app)

# In-memory storage for complaints
complaintStore = {}
staffInfoStore = {}

# Possible statuses
statusOptions = ["Received", "Assigned", "InProgress", "Resolved", "Closed"]

# Possible departments for assignment
departments = ["Billing", "ProductSupport", "TechnicalSupport", "CustomerService"]


def getNextComplaintId():
    return uuid.uuid4().hex[:8].upper()


@app.route("/api/registerComplaint", methods=["POST"])
def registerComplaint():
    data = request.json
    requiredFields = [
        "customerName",
        "customerEmail",
        "complaintDescription",
        "priority",
    ]

    # Validate input
    for field in requiredFields:
        if field not in data:
            return jsonify({"error": f"Missing field: {field}"}), 400

    complaintId = getNextComplaintId()
    complaint = {
        "complaintId": complaintId,
        "customerName": data["customerName"],
        "customerEmail": data["customerEmail"],
        "complaintDescription": data["complaintDescription"],
        "priority": data["priority"],  # e.g., Low, Medium, High
        "departmentAssigned": None,
        "status": "Received",
        "dateCreated": datetime.now(timezone.utc).isoformat(),
        "dateUpdated": datetime.now(timezone.utc).isoformat(),
        "assignedTo": None,
        "comments": [],
    }
    complaintStore[complaintId] = complaint
    return (
        jsonify(
            {"message": "Complaint registered successfully", "complaintId": complaintId}
        ),
        201,
    )


@app.route("/api/assignComplaint", methods=["POST"])
def assignComplaint():
    data = request.json
    if (
        "complaintId" not in data
        or "department" not in data
        or "assignedTo" not in data
    ):
        return (
            jsonify(
                {"error": "complaintId, department, and assignedTo fields are required"}
            ),
            400,
        )

    complaintId = data["complaintId"]
    department = data["department"]
    assignedTo = data["assignedTo"]

    if complaintId not in complaintStore:
        return jsonify({"error": "Complaint not found"}), 404
    if department not in departments:
        return jsonify({"error": f"Invalid department. Choose from {departments}"}), 400

    complaint = complaintStore[complaintId]
    complaint["departmentAssigned"] = department
    complaint["assignedTo"] = assignedTo
    complaint["status"] = "Assigned"
    complaint["dateUpdated"] = datetime.utcnow().isoformat()
    complaint["comments"].append(
        {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "comment": f"Complaint assigned to {assignedTo} in {department} department",
        }
    )
    return jsonify({"message": "Complaint assigned successfully"}), 200


@app.route("/api/updateStatus", methods=["POST"])
def updateStatus():
    data = request.json
    if "complaintId" not in data or "status" not in data:
        return jsonify({"error": "complaintId and status fields are required"}), 400

    complaintId = data["complaintId"]
    newStatus = data["status"]

    if complaintId not in complaintStore:
        return jsonify({"error": "Complaint not found"}), 404
    if newStatus not in statusOptions:
        return jsonify({"error": f"Invalid status. Choose from {statusOptions}"}), 400

    complaint = complaintStore[complaintId]
    complaint["status"] = newStatus
    complaint["dateUpdated"] = datetime.now(timezone.utc).isoformat()

    if "comment" in data:
        complaint["comments"].append(
            {
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "comment": data["comment"],
            }
        )

    return jsonify({"message": f"Complaint status updated to {newStatus}"}), 200


@app.route("/api/getComplaint/<int:complaintId>", methods=["GET"])
def getComplaint(complaintId):
    if complaintId not in complaintStore:
        return jsonify({"error": "Complaint not found"}), 404
    return jsonify(complaintStore[complaintId]), 200


@app.route("/api/listComplaints", methods=["GET"])
def listComplaints():
    # Optional filters
    statusFilter = request.args.get("status")
    departmentFilter = request.args.get("department")

    filteredComplaints = []
    for complaint in complaintStore.values():
        if statusFilter and complaint["status"] != statusFilter:
            continue
        if departmentFilter and complaint["departmentAssigned"] != departmentFilter:
            continue
        filteredComplaints.append(complaint)

    return jsonify(filteredComplaints), 200


@app.route("/api/registerStaff", methods=["POST"])
def registerStaff():
    data = request.json

    if "emailId" not in data or "password" not in data:
        return jsonify({"error": "emailId and password required"}), 400

    emailId = data["emailId"]
    if emailId in staffInfoStore:
        return jsonify({"error": "Staff already registered"}), 400
    password = bcrypt.hashpw(data["password"].encode("utf-8"), bcrypt.gensalt())

    staffInfoStore[emailId] = {"emailId": emailId, "password": password}
    return jsonify({"message": f"Staff {emailId} registered successfully"}), 201


@app.route("/api/loginStaff", methods=["POST"])
def loginStaff():
    data = request.json

    if "emailId" not in data or "password" not in data:
        return (
            jsonify(
                {"error": "Email ID and password required"},
            ),
            400,
        )

    emailId = data["emailId"]
    password = data["password"]

    if emailId not in staffInfoStore:
        return (
            jsonify({"error": "Staff not found."}),
            404,
        )

    stored_password = staffInfoStore[emailId]["password"]

    if bcrypt.checkpw(password.encode("utf-8"), stored_password):
        token = jwt.encode(
            {
                "emailId": emailId,
                "exp": datetime.now(timezone.utc) + timedelta(hours=1),
            },
            SECRET_KEY,
            algorithm="HS256",
        )
        return jsonify({"message": "Login successful", "token": token}), 200
    else:
        return jsonify({"error": "Invalid credentials"}), 401


if __name__ == "__main__":
    app.run(debug=True)
    # app.run(host="0.0.0.0", port=8000) # For PRODUCTION, keep commented if not hosting
