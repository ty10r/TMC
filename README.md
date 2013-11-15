TMC
===

This repo contains documents related to UCLA's Fall 2013 CS130 Ticket Master Team C.


DEPLOYMENT
==========
- Push the local changes to this repo.
- Connect to our aws server: 				ssh -i tm-ucla-widget-1.pem.cer ubuntu@ec2-50-19-197-53.compute-1.amazonaws.com
- Kill the process currently running Node
- Pull your changes to the server: 			Username: TMCDeploy	Password: TMCD3ploy
- restart the node server: 					node TMC/widget/server/server.js &

