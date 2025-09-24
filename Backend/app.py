from flask import Flask, request, jsonify
from datetime import datetime

app = Flask(__name__)

# In-memory storage for complaints
complaintStore = {}
nextComplaintId = 1

# Possible statuses
statusOptions = ["Received", "Assigned", "InProgress", "Resolved", "Closed"]

# Possible departments for assignment
departments = ["Billing", "ProductSupport", "TechnicalSupport", "CustomerService"]


def getNextComplaintId():
    global nextComplaintId
    complaintId = nextComplaintId
    nextComplaintId += 1
    return complaintId


@app.route("/registerComplaint", methods=["POST"])
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
        "dateCreated": datetime.utcnow().isoformat(),
        "dateUpdated": datetime.utcnow().isoformat(),
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


@app.route("/assignComplaint", methods=["POST"])
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
            "timestamp": datetime.utcnow().isoformat(),
            "comment": f"Complaint assigned to {assignedTo} in {department} department",
        }
    )
    return jsonify({"message": "Complaint assigned successfully"}), 200


@app.route("/updateStatus", methods=["POST"])
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
    complaint["dateUpdated"] = datetime.utcnow().isoformat()

    if "comment" in data:
        complaint["comments"].append(
            {"timestamp": datetime.utcnow().isoformat(), "comment": data["comment"]}
        )

    return jsonify({"message": f"Complaint status updated to {newStatus}"}), 200


@app.route("/getComplaint/<int:complaintId>", methods=["GET"])
def getComplaint(complaintId):
    if complaintId not in complaintStore:
        return jsonify({"error": "Complaint not found"}), 404
    return jsonify(complaintStore[complaintId]), 200


@app.route("/listComplaints", methods=["GET"])
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


if __name__ == "__main__":
    app.run(debug=True)
    # app.run(host="0.0.0.0", port=8000) # For PRODUCTION, keep commented if not hosting
