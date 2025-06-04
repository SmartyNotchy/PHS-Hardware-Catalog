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
            cursor.execute("DROP TABLE IF EXISTS groups")
            cursor.execute("DROP TABLE IF EXISTS components")
            cursor.execute("DROP TABLE IF EXISTS component_instances")
            cursor.execute("DROP TABLE IF EXISTS request_forms")
            cursor.execute("DROP TABLE IF EXISTS return_forms")

            cursor.execute('''
                CREATE TABLE projects (
                    uuid VARCHAR(36) PRIMARY KEY,
                    name TEXT,
                    groups TEXT,
                    active BOOLEAN
                )
            ''')

            cursor.execute('''
                CREATE TABLE groups (
                    uuid VARCHAR(36) PRIMARY KEY,
                    name TEXT,
                    students TEXT,
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
                    condition TEXT,
                    group_uuid VARCHAR(36)
                )
            ''')

            cursor.execute('''
                CREATE TABLE request_forms (
                    uuid VARCHAR(36) PRIMARY KEY,
                    component VARCHAR(36),
                    group_uuid VARCHAR(36),
                    reason TEXT,
                    status TEXT,
                    teacherMessage TEXT
                )
            ''')

            cursor.execute('''
                CREATE TABLE return_forms (
                    uuid VARCHAR(36) PRIMARY KEY,
                    component_instance VARCHAR(36),
                    group_uuid VARCHAR(36),
                    details TEXT,
                    condition TEXT,
                    status TEXT
                )
            ''')

            cursor.execute('''
                CREATE TABLE teachers (
                    name TEXT PRIMARY KEY,
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
    return jsonify(results)

def get_catalog():
    with get_connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute("SELECT uuid FROM components")
            results = [row['uuid'] for row in cursor.fetchall()]
    return jsonify(results)

def get_obj(obj_type, uuid):
    with get_connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute(f"SELECT * FROM {obj_type}s WHERE uuid=%s", (uuid,))
            result = cursor.fetchone()
            if result:
                result['type'] = obj_type
                return jsonify({"success": True, "data": result})
            return jsonify({"success": False, "data": None})

def get_obj_list(obj_type, uuid_list):
    placeholders = ','.join(['%s'] * len(uuid_list))
    with get_connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute(f"SELECT * FROM {obj_type}s WHERE uuid IN ({placeholders})", uuid_list)
            results = cursor.fetchall()
            for item in results:
                item['type'] = obj_type
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
            cursor.execute(
                "INSERT INTO request_forms (uuid, component, group_uuid, reason, status) VALUES (%s, %s, %s, %s, 'pending')",
                (form_uuid, component_uuid, group_uuid, reason)
            )
            conn.commit()
    return jsonify({"success": True, "message": "Request submitted."})

def send_return_form(instance_uuid, group_uuid, details, condition):
    form_uuid = gen_uuid()
    with get_connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute(
                "INSERT INTO return_forms (uuid, component_instance, group_uuid, details, condition, status) VALUES (%s, %s, %s, %s, %s, 'pending')",
                (form_uuid, instance_uuid, group_uuid, details, condition)
            )
            conn.commit()
    return jsonify({"success": True, "message": "Return submitted."})

#####################################
###### POST COMMANDS - TEACHER ######
#####################################

def teacher_login(password):
    with get_connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute("SELECT name FROM teachers WHERE password=%s", (password,))
            row = cursor.fetchone()
            if row:
                token = str(gen_uuid_raw())
                cursor.execute("UPDATE teachers SET loginToken=%s WHERE name=%s", (token, row["name"]))
                conn.commit()
                return jsonify({"success": True, "token": token, "name": row["name"]})
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

def add_instance(token, component_uuid, details, condition):
    if not verify_admin_token(token):
        return jsonify({"success": False, "message": "Admin access required."})

    uuid = gen_uuid()
    with get_connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute(
                '''
                INSERT INTO component_instances (uuid, component, details, available, pendingReq, condition, group_uuid)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
                ''',
                (uuid, component_uuid, details, True, False, condition, "")
            )
            # Update parent component's instance list
            cursor.execute("SELECT instances FROM components WHERE uuid=%s", (component_uuid,))
            row = cursor.fetchone()
            if row:
                instances = json.loads(row['instances'])
                instances.append(uuid)
                cursor.execute("UPDATE components SET instances=%s WHERE uuid=%s", (json.dumps(instances), component_uuid))
            conn.commit()
    return jsonify({"success": True, "uuid": uuid})

def create_project(token, name):
    if not verify_admin_token(token):
        return jsonify({"success": False, "message": "Admin access required."})

    uuid = gen_uuid()
    with get_connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute(
                "INSERT INTO projects (uuid, name, groups, active) VALUES (%s, %s, %s, %s)",
                (uuid, name, json.dumps([]), True)
            )
            conn.commit()
    return jsonify({"success": True, "uuid": uuid})

def add_groups(token, project_uuid, group_uuids):
    if not verify_admin_token(token):
        return jsonify({"success": False, "message": "Admin access required."})

    with get_connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute("SELECT groups FROM projects WHERE uuid=%s", (project_uuid,))
            row = cursor.fetchone()
            if not row:
                return jsonify({"success": False, "message": "Project not found."})

            existing_groups = json.loads(row['groups'])
            updated_groups = list(set(existing_groups + group_uuids))
            cursor.execute("UPDATE projects SET groups=%s WHERE uuid=%s", (json.dumps(updated_groups), project_uuid))
            conn.commit()
    return jsonify({"success": True, "updatedGroups": updated_groups})

def update_group_students(token, group_uuid, student_text):
    if not verify_admin_token(token):
        return jsonify({"success": False, "message": "Admin access required."})

    with get_connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute("UPDATE groups SET students=%s WHERE uuid=%s", (student_text, group_uuid))
            conn.commit()
    return jsonify({"success": True})

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
    elif cmdName == "admin-add-groups":
        return add_groups(*args)
    elif cmdName == "admin-update-group-students":
        return update_group_students(*args)
    elif cmdName == "admin-reset-db":
        return initialize_database() if verify_admin_token(args[0]) else jsonify({"success": False, "message": "Admin access required."})
    elif cmdName == "send-request-form":
        return send_request_form(*args)
    elif cmdName == "send-return-form":
        return send_return_form(*args)
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
    elif cmdName == "get-obj":
        return get_obj(*args)
    elif cmdName == "get-obj-list":
        return get_obj_list(*args)
    elif cmdName == "verify-token":
        return verify_admin_token(*args)
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
            return processPostCommand(data.get("cmdName"), data.get("uuid"), data.get("args", []))
        else:
            return jsonify({"success": False, "message": "Verification failed."})

@app.route('/', methods=['GET'])
def handle_get():
    data = {
        "cmdName": request.args.get("cmdName"),
        "uuid": request.args.get("uuid"),
        "args": request.args.getlist("args")
    }
    return processGetCommand(data["cmdName"], data["uuid"], data["args"])
