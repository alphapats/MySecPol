# MySecPol
MySecPol: An Architecture for Safe and Secure Browsing using Client-Side Policy

Web browsers handle content from different sources making them prone to various attacks. Currently, users rely either on web developers or on different browser extensions for protection against different attacks. In this paper, we propose a simple architecture for defining client-side policies using a policy language MySecPol. The client-side polices give the user control over the content being served to him. Users can define their policies independent of the browser or the Operating System (OS). The policies are then realized by integrating them into the browser with appropriate mechanisms. The policy specification can combine various security mechanisms providing a robust protection. We describe an implementation of MySecPol as a Google Chrome extension. We show how several of the existing approaches are captured as instances of MySecPol. We have further, evaluated the system  with real-world websites for testing soundness of the approach by checking the functionality of these sites relative to different policies. A comparison of our system is made with related works with respect to various performance measures.


# files:
policy: File contains client policy written in MySecPol

testparser.py: Parser which reads the policy file and sets extension variables.

sampleblock.js : File contains sample code without variable values. The parser copies the content of this file, adds variable values and creates new file test/block.js

samplepopup.js : File contains sample code without variable values for popup.html . The parser copies the content of this file, adds variable values and creates new file test/popup.js

test folder: Contains browser extension code.


# usage:
1.  Write policy.
2.  Parse the policy using testparser.py

    python3 testparser.py policy
3.  Load extension in your chrome browser. For details, read below.

#Extensions can be loaded in unpacked mode by following the following steps:
1. Type in address bar chrome://extensions  or Goto menu -> Tools -> Extensions).
2. Enable Developer mode by ticking the checkbox in the upper-right corner.
3. Click on the "Load unpacked extension..." button.
4. Select the test directory which contains our unpacked extension.
