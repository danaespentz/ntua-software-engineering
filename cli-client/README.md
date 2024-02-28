# cli

**Initial file** :
- index.js

**Requirements ("npm install" if needed)** :
- node.js
- commander
- axios
- program
- python-shell

**How to run**:
- first parameter is always "se2350"
- add parameter "-h" or "--h" for additional info
- This must be the format for all included commands:<br />
&nbsp; &nbsp; &nbsp;se2350 user --username<username><br />
&nbsp; &nbsp; &nbsp;se2350 adduser --username<username> --password<password><br />
&nbsp; &nbsp; &nbsp;se2350 title --titleID<titleID> --format <format><br />
&nbsp; &nbsp; &nbsp;se2350 name --nameID<nameID> --format <format><br />
&nbsp; &nbsp; &nbsp;se2350 searchtitle --titlepart<titlepart> --format <format><br />
&nbsp; &nbsp; &nbsp;se2350 searchname --namepart<namepart> --format <format><br />
&nbsp; &nbsp; &nbsp;se2350 bygenre --min <min> --from <from> --to <to> --format <format><br />
&nbsp; &nbsp; &nbsp;se2350 healthcheck<br />
&nbsp; &nbsp; &nbsp;se2350 resetall<br />
