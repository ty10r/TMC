TMC
===

This repo contains documents related to UCLA's Fall 2013 CS130 Ticket Master Team C.


INSTALLATION AND RUNNING
==========
1. Follow the nodejs.org installation process
2. Clone this repository
3. Enter the widget/server/ folder
4. Run npm install
5. Run node server.js

DEPLOYMENT
==========
- Push the local changes to this repo.
- Connect to our aws server: 				ssh -i tm-ucla-widget-1.pem.cer ubuntu@ec2-50-19-197-53.compute-1.amazonaws.com
- Kill the process currently running Node
- Pull your changes to the server: 			Username: TMCDeploy	Password: TMCD3ploy
- restart the node server: 					node TMC/widget/server/server.js &


CONTRIBUTING
===========
For large changes, please push your changes to a new remote branch
git push origin <local-branch-name>:<remote-branch-name>
Then create a pull request on the branch on github and tag other contributors to review
After the code is approved by concensus, merge with the master branch