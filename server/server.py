from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
from enum import Enum
from datetime import datetime, timedelta
from uuid import uuid4 as gen_uuid_raw
import json
import random
import math
import json
import pymysql

######################################
###### GENERAL HELPER FUNCTIONS ######
######################################

def calc_diff_s(newD, oldD):
    return (newD - oldD).total_seconds()

def gen_uuid():
    return str(gen_uuid_raw())

###################################
###### MYSQL SETUP & HELPERS ######
###################################

MYSQL_HOST = 'SMCS2027PFP.mysql.pythonanywhere-services.com'
MYSQL_USER = 'SMCS2027PFP'
MYSQL_PSWD = 'ThinkThreeWritesAhead'
MYSQL_DB = 'SMCS2027PFP$default'

def get_connection():
    return pymysql.connect(
        host=MYSQL_HOST,
        user=MYSQL_USER,
        password=MYSQL_PSWD,
        database=MYSQL_DB,
        cursorclass=pymysql.cursors.DictCursor
    )

def initialize_database():
    print("Are you sure? This will clear existing tables! Type CLEAR to continue.")
    inp = input()
    if inp != "CLEAR":
        return

    with get_connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute("DROP TABLE IF EXISTS projects")
            cursor.execute("DROP TABLE IF EXISTS group_data")
            cursor.execute("DROP TABLE IF EXISTS components")
            cursor.execute("DROP TABLE IF EXISTS component_instances")
            cursor.execute("DROP TABLE IF EXISTS request_forms")
            cursor.execute("DROP TABLE IF EXISTS return_forms")
            cursor.execute("DROP TABLE IF EXISTS teachers")

            cursor.execute('''
                CREATE TABLE projects (
                    uuid VARCHAR(36) PRIMARY KEY,
                    name TEXT,
                    group_list TEXT,
                    active BOOLEAN
                )
            ''')

            cursor.execute('''
                CREATE TABLE group_data (
                    uuid VARCHAR(36) PRIMARY KEY,
                    name TEXT,
                    requests TEXT,
                    reports TEXT,
                    inventory TEXT
                )
            ''')

            cursor.execute('''
                CREATE TABLE components (
                    uuid VARCHAR(36) PRIMARY KEY,
                    name TEXT,
                    image TEXT,
                    details TEXT,
                    instances TEXT
                )
            ''')

            cursor.execute('''
                CREATE TABLE component_instances (
                    uuid VARCHAR(36) PRIMARY KEY,
                    component VARCHAR(36),
                    details TEXT,
                    available BOOLEAN,
                    pendingReq BOOLEAN,
                    itemCondition TEXT,
                    group_uuid VARCHAR(36)
                )
            ''')

            cursor.execute('''
                CREATE TABLE request_forms (
                    uuid VARCHAR(36) PRIMARY KEY,
                    component_instance VARCHAR(36),
                    group_uuid VARCHAR(36),
                    itemCondition TEXT
                )
            ''')

            cursor.execute('''
                CREATE TABLE return_forms (
                    uuid VARCHAR(36) PRIMARY KEY,
                    component_instance VARCHAR(36),
                    group_uuid VARCHAR(36),
                    details TEXT,
                    itemCondition TEXT,
                    status TEXT
                )
            ''')

            cursor.execute('''
                CREATE TABLE teachers (
                    uuid VARCHAR(36) PRIMARY KEY,
                    name TEXT,
                    password TEXT,
                    loginToken TEXT
                )
            ''')

            conn.commit()
    return "Database initialized."

##########################
###### GET COMMANDS ######
##########################

def get_projects():
    with get_connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute("SELECT uuid FROM projects WHERE active=1")
            results = [row['uuid'] for row in cursor.fetchall()]
            results = sorted(results)
    return jsonify(results)

def get_catalog():
    with get_connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute("SELECT uuid FROM components")
            results = [row['uuid'] for row in cursor.fetchall()]
    return jsonify(results)

def get_requests():
    with get_connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute("SELECT uuid FROM request_forms")
            results = [row['uuid'] for row in cursor.fetchall()]
    return jsonify(results)

def get_returns():
    with get_connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute("SELECT uuid FROM return_forms")
            results = [row['uuid'] for row in cursor.fetchall()]
    return jsonify(results)

def get_obj(obj_type, uuid):
    obj_type += "s"
    if (obj_type == "groups"):
        obj_type = "group_data"
    with get_connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute(f"SELECT * FROM {obj_type} WHERE uuid=%s", (uuid,))
            result = cursor.fetchone()
            if result:
                result['type'] = obj_type
                return jsonify({"success": True, "data": result})
            return jsonify({"success": False, "data": None})

def get_obj_list(args):
    obj_type = args[0] + "s"
    if (obj_type == "groups"):
        obj_type = "group_data"
    placeholders = ','.join(['%s'] * len(args[1:]))
    with get_connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute(f"SELECT * FROM {obj_type} WHERE uuid IN ({placeholders})", args[1:])
            results = cursor.fetchall()
            results = sorted(results, key=lambda x : x['uuid'])
            for item in results:
                item['type'] = args[0]
    return jsonify({"success": True, "data": results})

def verify_admin_token(token):
    if not token:
        return False
    with get_connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute("SELECT * FROM teachers WHERE loginToken=%s", (token,))
            return cursor.fetchone() is not None

#####################################
###### POST COMMANDS - STUDENT ######
#####################################

def send_request_form(component_uuid, group_uuid, reason):
    form_uuid = gen_uuid()
    with get_connection() as conn:
        with conn.cursor() as cursor:
            # Insert request form
            cursor.execute(
                "INSERT INTO request_forms (uuid, component_instance, group_uuid, reason, status) VALUES (%s, %s, %s, %s, 'pending')",
                (form_uuid, component_uuid, group_uuid, "Requested " + datetime.today().strftime("%B %-d") + "<br>" + reason)
            )

            # Update the instance to mark as pending
            cursor.execute(
                "UPDATE component_instances SET pendingReq=TRUE WHERE uuid=%s",
                (component_uuid,)
            )

            # Fetch existing requests for the group
            cursor.execute(
                "SELECT requests FROM group_data WHERE uuid=%s",
                (group_uuid,)
            )

            row = cursor.fetchone()
            if row:
                request_list = json.loads(row.get("requests", "[]"))
            else:
                request_list = []

            # Append new request UUID and update group
            request_list.append(form_uuid)
            cursor.execute(
                "UPDATE group_data SET requests=%s WHERE uuid=%s",
                (json.dumps(request_list), group_uuid)
            )

            conn.commit()
    return jsonify({"success": True, "message": "Request submitted."})

def send_return_form(instance_uuid, group_uuid, itemCondition):
    form_uuid = gen_uuid()
    with get_connection() as conn:
        with conn.cursor() as cursor:
            # Insert the return form with 'pending' status
            cursor.execute(
                "INSERT INTO return_forms (uuid, component_instance, group_uuid, itemCondition) VALUES (%s, %s, %s, %s, %s)",
                (form_uuid, instance_uuid, group_uuid, itemCondition)
            )

            # Clear the group_uuid from the instance
            cursor.execute(
                "UPDATE component_instances SET group_uuid = NULL WHERE uuid = %s",
                (instance_uuid,)
            )

            # Mark the item as available and not pending a request, and update its condition
            cursor.execute(
                "UPDATE component_instances SET available = TRUE, pendingReq = FALSE, itemCondition = %s WHERE uuid = %s",
                (itemCondition, instance_uuid)
            )

            # Fetch current group inventory JSON and parse it
            cursor.execute("SELECT inventory FROM group_data WHERE uuid=%s", (group_uuid,))
            res = cursor.fetchone()
            inventory_json = res["inventory"] if res and res["inventory"] else "[]"
            inventory = json.loads(inventory_json)

            # Remove instance_uuid from inventory if present
            if instance_uuid in inventory:
                inventory.remove(instance_uuid)

            # Update inventory back to the database
            cursor.execute(
                "UPDATE group_data SET inventory = %s WHERE uuid = %s",
                (json.dumps(inventory), group_uuid)
            )

            conn.commit()
    return jsonify({"success": True, "message": "Return submitted."})


#####################################
###### POST COMMANDS - TEACHER ######
#####################################

def add_teacher(name, password):
    with get_connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute(
                "INSERT INTO teachers (uuid, name, password, loginToken) VALUES (%s, %s, %s, %s)",
                (gen_uuid(), name, password, gen_uuid())
            )
            conn.commit()

def teacher_login(password):
    with get_connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute("SELECT uuid FROM teachers WHERE password=%s", (password,))
            row = cursor.fetchone()
            if row:
                token = str(gen_uuid_raw())
                cursor.execute("UPDATE teachers SET loginToken=%s WHERE uuid=%s", (token, row["uuid"]))
                conn.commit()
                return jsonify({"success": True, "token": token, "uuid": row["uuid"]})
            else:
                return jsonify({"success": False, "message": "Invalid password."})

def add_component(token, name, image, details):
    if not verify_admin_token(token):
        return jsonify({"success": False, "message": "Admin access required."})

    uuid = gen_uuid()
    with get_connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute(
                "INSERT INTO components (uuid, name, image, details, instances) VALUES (%s, %s, %s, %s, %s)",
                (uuid, name, image, details, json.dumps([]))
            )
            conn.commit()
    return jsonify({"success": True, "uuid": uuid})

def add_instance(token, component_uuid, details, itemCondition):
    if not verify_admin_token(token):
        return jsonify({"success": False, "message": "Admin access required."})

    uuid = gen_uuid()
    with get_connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute(
                '''
                INSERT INTO component_instances (uuid, component, details, available, pendingReq, itemCondition, group_uuid)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
                ''',
                (uuid, component_uuid, details, True, False, itemCondition, "")
            )
            cursor.execute("SELECT instances FROM components WHERE uuid=%s", (component_uuid,))
            row = cursor.fetchone()
            if row:
                instances = json.loads(row['instances'])
                instances.append(uuid)
                cursor.execute("UPDATE components SET instances=%s WHERE uuid=%s", (json.dumps(instances), component_uuid))
            conn.commit()
    return jsonify({"success": True, "uuid": uuid})

def edit_component(token, comp_uuid, comp_name, comp_details):
    if not verify_admin_token(token):
        return jsonify({"success": False, "message": "Admin access required."})

    with get_connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute(
                "UPDATE components SET name=%s, details=%s WHERE uuid=%s",
                (comp_name, comp_details, comp_uuid)
            )
            conn.commit()
    return jsonify({"success": True, "message": "Component updated."})

def edit_instance(token, instance_uuid, instance_details, instance_condition):
    if not verify_admin_token(token):
        return jsonify({"success": False, "message": "Admin access required."})

    with get_connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute(
                "UPDATE component_instances SET details=%s, itemCondition=%s WHERE uuid=%s",
                (instance_details, instance_condition, instance_uuid)
            )
            conn.commit()
    return jsonify({"success": True, "message": "Instance updated."})


def create_project(token, name):
    if not verify_admin_token(token):
        return jsonify({"success": False, "message": "Admin access required."})

    uuid = gen_uuid()
    with get_connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute(
                "INSERT INTO projects (uuid, name, group_list, active) VALUES (%s, %s, %s, %s)",
                (uuid, name, json.dumps([]), True)
            )
            conn.commit()
    return jsonify({"success": True, "uuid": uuid})

def add_group(token, project_uuid, group_name):
    if not verify_admin_token(token):
        return jsonify({"success": False, "message": "Admin access required."})

    group_uuid = gen_uuid()
    with get_connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute(
                '''
                INSERT INTO group_data (uuid, name, requests, reports, inventory)
                VALUES (%s, %s, %s, %s, %s)
                ''',
                (group_uuid, group_name, json.dumps([]), json.dumps([]), json.dumps([]))
            )

            cursor.execute("SELECT group_list FROM projects WHERE uuid=%s", (project_uuid,))
            row = cursor.fetchone()
            if not row:
                return jsonify({"success": False, "message": "Project not found."})

            existing_groups = json.loads(row['group_list'])
            updated_groups = list(set(existing_groups + [group_uuid]))
            cursor.execute("UPDATE projects SET group_list=%s WHERE uuid=%s", (json.dumps(updated_groups), project_uuid))
            conn.commit()

    return jsonify({"success": True, "group_uuid": group_uuid, "updatedGroups": updated_groups})

def edit_group(token, group_uuid, new_name):
    if not verify_admin_token(token):
        return jsonify({"success": False, "message": "Admin access required."})

    with get_connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute(
                "UPDATE group_data SET name=%s WHERE uuid=%s",
                (new_name, group_uuid)
            )
            conn.commit()
    return jsonify({"success": True, "message": "Group updated."})

def update_group_students(token, group_uuid, student_text):
    if not verify_admin_token(token):
        return jsonify({"success": False, "message": "Admin access required."})

    with get_connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute(
                "UPDATE group_data SET students=%s WHERE uuid=%s",
                (student_text, group_uuid)
            )
            conn.commit()
    return jsonify({"success": True})

def accept_request(token, request_uuid, message):
    if not verify_admin_token(token):
        return jsonify({"success": False, "message": "Admin access required."})

    with get_connection() as conn:
        with conn.cursor() as cursor:
            # Get instance UUID and group UUID
            cursor.execute(
                "SELECT component_instance, group_uuid FROM request_forms WHERE uuid=%s",
                (request_uuid,)
            )
            row = cursor.fetchone()
            if not row:
                return jsonify({"success": False, "message": "Request not found."})

            instance_uuid = row["component_instance"]
            group_uuid = row["group_uuid"]

            # Set instance to unavailable
            cursor.execute(
                "UPDATE component_instances SET available=FALSE,group_uuid=%s WHERE uuid=%s",
                (group_uuid,instance_uuid,)
            )

            # Fetch current group inventory JSON and parse it
            cursor.execute("SELECT inventory FROM group_data WHERE uuid=%s", (group_uuid,))
            res = cursor.fetchone()
            inventory_json = res["inventory"] if res and res["inventory"] else "[]"
            inventory = json.loads(inventory_json)

            if instance_uuid not in inventory:
                inventory.append(instance_uuid)

            # Update group inventory JSON
            cursor.execute(
                "UPDATE group_data SET inventory=%s WHERE uuid=%s",
                (json.dumps(inventory), group_uuid)
            )

            # Update request status and teacher message
            cursor.execute(
                "UPDATE request_forms SET status='accepted', teacherMessage=%s WHERE uuid=%s",
                (message, request_uuid)
            )

            conn.commit()

    return jsonify({"success": True, "message": f"Request accepted for instance {instance_uuid} in group {group_uuid}."})


def reject_request(token, request_uuid, message):
    if not verify_admin_token(token):
        return jsonify({"success": False, "message": "Admin access required."})

    with get_connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute(
                "SELECT component_instance FROM request_forms WHERE uuid=%s",
                (request_uuid,)
            )
            row = cursor.fetchone()
            if not row:
                return jsonify({"success": False, "message": "Request not found."})
            instance_uuid = row["component_instance"]

            cursor.execute(
                "UPDATE request_forms SET status='rejected', teacherMessage=%s WHERE uuid=%s",
                (message, request_uuid)
            )

            cursor.execute(
                "UPDATE component_instances SET available=TRUE, pendingReq=FALSE WHERE uuid=%s",
                (instance_uuid,)
            )

            conn.commit()
    return jsonify({"success": True, "message": "Request rejected."})


def cancel_request(request_uuid):
    with get_connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute(
                "SELECT component_instance, group_uuid FROM request_forms WHERE uuid=%s",
                (request_uuid,)
            )
            row = cursor.fetchone()
            if not row:
                return jsonify({"success": False, "message": "Request not found."})

            instance_uuid = row["component_instance"]
            group_uuid = row["group_uuid"]

            # Set instance available and not pending
            cursor.execute(
                "UPDATE component_instances SET available=TRUE, pendingReq=FALSE WHERE uuid=%s",
                (instance_uuid,)
            )

            # Fetch current requests JSON and parse it
            cursor.execute("SELECT requests FROM group_data WHERE uuid=%s", (group_uuid,))
            res = cursor.fetchone()
            requests_json = res["requests"] if res and res["requests"] else "[]"
            requests = json.loads(requests_json)

            if request_uuid in requests:
                requests.remove(request_uuid)

            cursor.execute(
                "UPDATE group_data SET requests=%s WHERE uuid=%s",
                (json.dumps(requests), group_uuid)
            )

            cursor.execute(
                "DELETE FROM request_forms WHERE uuid=%s",
                (request_uuid,)
            )

            conn.commit()
    return jsonify({"success": True, "message": "Request cancelled."})

################################
###### COMMAND PROCESSING ######
################################

def processPostCommand(cmdName, uuid, args):
    print(f"POST Command: {cmdName}, UUID: {uuid}, Args: {args}")

    if cmdName == "teacher-login":
        return teacher_login(*args)
    elif cmdName == "admin-add-component":
        return add_component(*args)
    elif cmdName == "admin-add-instance":
        return add_instance(*args)
    elif cmdName == "admin-create-project":
        return create_project(*args)
    elif cmdName == "admin-add-group":
        return add_group(*args)
    elif cmdName == "admin-edit-group":
        return edit_group(*args)
    elif cmdName == "admin-edit-component":
        return edit_component(*args)
    elif cmdName == "admin-edit-instance":
        return edit_instance(*args)
    elif cmdName == "admin-update-group-students":
        return update_group_students(*args)
    elif cmdName == "admin-reset-db":
        return initialize_database() if verify_admin_token(args[0]) else jsonify({"success": False, "message": "Admin access required."})
    elif cmdName == "send-request-form":
        return send_request_form(*args)
    elif cmdName == "send-return-form":
        return send_return_form(*args)
    elif cmdName == "accept-request":
        return accept_request(*args)
    elif cmdName == "reject-request":
        return reject_request(*args)
    elif cmdName == "cancel-request":
        return cancel_request(*args)
    else:
        return jsonify({"success": False, "message": f"Unknown Command Name '{cmdName}'"})

def processGetCommand(cmdName, uuid, args):
    print(f"GET Command: {cmdName}, UUID: {uuid}, Args: {args}")
    if cmdName == "ping":
        return jsonify({"success": True, "message": "Pong!"})
    elif cmdName == "get-projects":
        return get_projects()
    elif cmdName == "get-catalog":
        return get_catalog()
    elif cmdName == "get-requests":
        return get_requests()
    elif cmdName == "get-returns":
        return get_returns()
    elif cmdName == "get-obj":
        return get_obj(*args)
    elif cmdName == "get-obj-list":
        return get_obj_list(args)
    elif cmdName == "verify-token":
        return jsonify({"is_admin": verify_admin_token(*args)})
    else:
        return jsonify({"success": False, "message": f"Unknown Command Name '{cmdName}'"})

################################
###### FLASK APP REQUESTS ######
################################

app = Flask(__name__)
CORS(app)

@app.route('/', methods=['POST'])
def handle_post():
    if request.method == 'POST':
        username = request.headers.get('username')
        password = request.headers.get('password')
        if username == "SMCS_PFP" and password == "ThreeComponentsAhead":
            data = request.get_json()
            res = processPostCommand(data.get("cmdName"), data.get("uuid"), data.get("args", []))
            print("Response JSON:", res.get_json())
            return res
        else:
            return jsonify({"success": False, "message": "Verification failed."})

@app.route('/', methods=['GET'])
def handle_get():
    data = {
        "cmdName": request.args.get("cmdName"),
        "uuid": request.args.get("uuid"),
        "args": request.args.getlist("args")
    }
    print(data["args"])
    args = data["args"]
    if len(args) == 1:
        args = args[0].split(",")
    print(args)

    res = processGetCommand(data["cmdName"], data["uuid"], args)
    print("Response JSON:", res.get_json())
    return res