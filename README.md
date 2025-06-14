# PHS Hardware Catalog

An online hardware catalog to assist SMCS teachers and sophomores with keeping track of expensive components during projects.

## Team

Dhruv Srivastava (@3DSrivas) - Project Manager

Daniel Shi (@Ducky-14) - Systems Analyst

William Park (@SmartyNotchy) - Lead Programmer

Khang Truong (@Coolpie2134) - Lead Tester

## Usage

Currently accessible via [https://smartynotchy.github.io/PHS-Hardware-Catalog/](https://smartynotchy.github.io/PHS-Hardware-Catalog/login.html)

## Deployment

Backend is currently run on a Flask webserver via [PythonAnywhere](https://smcs2027pfp.pythonanywhere.com/).

No changes are needed to deploy to a new domain; simply clone the repo and publish the site to the domain of choice.

To change the domain used by the backend (i.e. to a different PythonAnywhere account), after hosting `server/server.py`, edit `SERVER_URL` in `server/requests.js` to point to the new domain used.
