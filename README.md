# OncallAssignments
This is a program to manage an "on-call" assignment for health-care students.

### Scenario
Students are told that they are "on-call" for a certain period of time.  During that time, they must monitor a Twitter feed.  At random times during the on-call period, the faculty member tweets the URL of a webpage containing a "consult".  Each student has an hour to 
- Review the consult
- Formulate a recommendation 
- Phone it in to a telephone number provided in the tweet

When the student calls the telephone number, they are greeted by a message saying something along the lines of 
 
_Thanks for calling me back.  What do you think we should do with this patient?_
 
The students then have two minutes to explain their recommendation.  They press a key to indicate they are finished.   The voice thanks them for their advice and hangs up.

Within a few minutes the student receives a text message (SMS) on their phone with a link to a recording of the the response they just left.  This SMS confirms to the student that their response was received and recorded.  If the student has an email on file that is associated with the caller ID of their phone, they will also be emailed the link.

Faculty can then go through the responses left by the students and score them on communications skills, clinical reasoning, professionalism, etc.

Additional features:
- Manage several different phone numbers.  For example, different classes could be using the application at the same time, just by calling different telephone numbers.
- Different permission levels for administrators and those who are just need to grade student responses
- Generate web pages to display a written consult and/or a grading rubric (key)
-  Transcribe the recording (extra fee charged by provider)
-  Look up the person registered to an incoming cell phone number (extra fee charged by provider)
-  Choose from different voices for outgoing messages
-  Specify the maximum amount of time students have to record their responses (no rambling).
-  Import and export students in CSV format






### Technical Details

This particular version uses [Twilio](http://www.Twilio.com) as a backend for the voice recording and text messages.   The faculty member has to have their own Twilio account and is responsible for whatever [charges](https://www.twilio.com/pricing) are incurred.   I do not have any financial interest in Twilio and this software could probably be easily adapted to use a different service.   Twilio just seemed to have a nicely documented REST API to work with.

![](https://github.com/gtheilman/OncallAssignments/blob/master/media/Process.png)
 
The program is written using the Meteor framework.   Meteor was chosen to allow for easy customization and deployment by faculty members with little programming experience.   

Meteor lends itself well to deployment using a [Platform as a Service](https://en.wikipedia.org/wiki/Platform_as_a_service) (Paas) provider.  These are services where the server itself is managed by the company and the user is simply responsible for uploading and maintaining the application running on it.  Two common options for deploying Meteor applications are Meteor itself and Modulus.

Deploying to [Meteor](https://www.meteor.com/try/6)   is the simplest option (and it is free!).  However, the service is really intended for prototyping, not production.  It would probably do fine for the short bursts of activity that would be associated with students calling in responses, but I've not really tested it under those conditions.

Deploying to [Modulus](http://help.modulus.io/customer/portal/articles/1647770-using-meteor-with-modulus) takes a few more steps to set up but is not really all that difficult.  Modulus charges to host the application but allows you to "turn off" the application during times it is not being used.  It also has the capability to scaling up for brief periods of time in case you find the website is not keeping up with student demand.

![ScreenShot.png](https://github.com/gtheilman/OncallAssignments/blob/master/media/ScreenShot.png)
 
###Installation

If you are a faculty member at an accredited health-care education school and would like assistance setting this up for your institution, please feel free to contact me.   

Installation does involve some use of the command line.  If you have no idea what "ls", "sudo" or "mkdir" mean, it might be best to get someone to help you.

**Step 1:**  Sign up for a [Twilio account](https://www.twilio.com/)

The Twilio website takes you through the process of obtaining a phone number, but [this video](https://www.youtube.com/watch?v=MR5sAZUlx_0) might also help.  At this point, you don't need to provide Twilio a credit card.  The phone number used in the demo account is limited, but sufficient for testing purposes.

**Step 2:** Install Meteor on your local Windows, Mac or Linux computer.

The official instructions are [here](https://www.meteor.com/install), but you also might find these [unofficial instructions](http://meteortips.com/first-meteor-tutorial/getting-started/) or [this video](https://youtu.be/9EsDHeI327s) helpful.   

The Windows installation process is pretty similar to what you see with installing other Windows programs.


The Mac installer requires that you use [Terminal](http://guides.macrumors.com/Terminal).   You can [find the icon to open Terminal](http://www.wikihow.com/Open-Applications-Using-Terminal-on-Mac) in your Applications/Utilities folder.

Once you have Terminal open, cut and paste [the command](https://www.meteor.com/install) from the Meteor website into the Terminal window.  Then press enter.

During the setup process, you will be prompted to register for an [account](https://www.meteor.com/) with Meteor. 

**Step 3:**  Create a directory (folder_ on your local computer.  Call it something like "OnCall".

If your are using a Mac, here are [instructions](https://support.apple.com/kb/PH18762?locale=en_US&viewlocale=en_US) for creating a folder.  [Here](http://windows.microsoft.com/en-us/windows/create-new-folder#1TC=windows-7) are the analogous instructions for Windows.


**Step 4:**  Download the zip file with the contents of this repository and unzip it into that directory. 
The "Download Zip" button is on the right-side of the repository page.  

**Step 5:**  Run the application locally at least once.  First time may take a while to start.

Type _meteor_ at the command prompt to  [run the application locally] (http://docs.meteor.com/#/basic/quickstart).   Then type CTRL-C to stop it.

**Step 6:**  Deploy the application

While you can open the application in a web browser while it is running oon your local computer, you'll likely have problems with Twilio if your program is not accessible to the outside world.   So, [deploy your application]  (http://docs.meteor.com/#/basic/quickstart)  on Meteor's free server to try it out.  For production purposes, a PaaS service like [Modulus](http://help.modulus.io/customer/portal/articles/1647770-using-meteor-with-modulus) may be more appropriate.

When you deploy to Meteor, you will be given a URL where your application can be accessed.  Make a note of it.

**Step 7:** Open the application in your web browser using the provided URL  

When the application is initially set up, the _login | password_  is _admin | admin_.   Change the admin password right away to something private.   Create a user account for yourself and use it rather than the admin account.  Make sure to give your new account the appropriate role (i.e., administrator).

**Step 8:**  Enter your Twilio credentials into the application.

This is the AccountSID and AuthToken associated with your Twilio account.   They are entered under "Credentials" in the application.

**Step 9:**  Call the Twilio phone number from a cell phone and leave a message.

**Step 10:**  Review the response within the application.






**Some Warnings **

While not absolutely necessary to use the program, this application is designed to store  student information.  Some of that information (such as phone number) might fall under  [Federal rules](http://www2.ed.gov/policy/gen/guid/fpco/ferpa/index.html) regarding  protecting student privacy.   While I have done my best to avoid situations which might expose private student information, I am making no guarantees as to data security.  You are responsible for reviewing the source code and making sure it meets the requirements of your institution.   If you are uncomfortable with adding student information to the application, you can still use it.   It's just that some of the features that involve matching students with consult responses won't work.

I have not installed any "backdoors" that would allow me to access your installation of the application.   You can review the source code to see for yourself.   If you wish me to provide some sort of assistance once you have the application set-up, you would have to provide me with credentials to access your application.
