from colorama import Fore, Style
import subprocess
import time

se2350="node --no-warnings index.js"
nameIDS = ["nm0000030", "nm0000035", "nm0000047", "nm0000085", "nm0000123"]
titleIDS = ["tt0000977", "tt0082473", "tt0090144", "tt0093099", "tt0097057"]
titleParts = ["Hen", "Horrorshow", "Feet", "That"]
nameParts = ["George", "Jenny", "Sean", "Anthony Daniels"]
users = ["danae", "user1"]

def makecli(x, param):
    if (x==0):
        return (se2350+" healthcheck")
    if (x==1):
        return (se2350+" resetall")
    if (x==2):
        return (se2350+" newakas --filename ../database/data/INSERT_DATA/truncated_title_akas.sql")
    if (x==3):
        return (se2350+" newtitles --filename ../database/data/INSERT_DATA/truncated_title_basics.sql")
    if (x==4):
        return (se2350+" newcrew --filename ../database/data/INSERT_DATA/truncated_title_crew.sql")
    if (x==5):
        return (se2350+" newepisode --filename ../database/data/INSERT_DATA/truncated_title_episode.sql")
    if (x==6):
        return (se2350+" newprincipals --filename ../database/data/INSERT_DATA/truncated_title_pricipals.sql")
    if (x==7):
        return (se2350+" newratings --filename ../database/data/INSERT_DATA/truncated_title_ratings.sql")
    if (x==8):
        return (se2350+" newnames --filename ../database/data/INSERT_DATA/truncated_name_basics.sql")
    if (x==9):
        return (se2350+" login --user_name "+param[0]+" --user_password "+param[1])
    if (x==10):
        return (se2350+" logout")
    if (x==11):
        return (se2350+" adduser --username "+param[0]+" --password "+param[1])
    if (x==12):
        return (se2350+" user --username "+param[0])
    if (x==13):
        return (se2350+" title --titleID "+param[0]+" --format csv")
    if (x==14):
        return (se2350+" name --nameID "+param[0]+" --format json")
    if (x==15):
        return (se2350+" searchtitle --titlepart "+param[0]+" --format csv")
    if (x==16):
        return (se2350+" searchname --namepart "+param[0]+" --format json")
    if (x==17):
        return (se2350+" bygenre --genre "+param[0]+" --min "+param[1]+" --from "+param[2]+"--to "+param[3]+" --format json")    

tests=1
counter = 0

def check(x, param):
    print(Style.RESET_ALL + Fore.YELLOW + f"Test for command {x} START" + Style.RESET_ALL)
    counter=0
    for i in range(1):
        time.sleep(3) 
        command = makecli(x, param)
        print(f"Running command: {command}")
        try:
            subprocess.run(command, shell=True, check=True)
            print(f"Command {command} executed successfully.")
            counter += 1
        except subprocess.CalledProcessError as e:
            print(f"Command {command} failed with error: {e}")
    print(f"Passes: {counter}/{tests}")
    if counter == tests:
        print("Status: " + Fore.GREEN + "Passed")
    else:
        print("Status: " + Fore.RED + "Failed")
    print(Fore.YELLOW + f"Test for command {x} END\n" + Style.RESET_ALL)
    time.sleep(3) 

for i in range(18):
    param=[]
    if i<9:
        check(i, [])
    elif i==9:
        param = ["danae", "danae"]
        check(i,param)
        check(i+1,[])
    elif i==10:
        continue
    elif i==11:
        param = ["user1", "pass1"]
        check(i,param)
    elif i==12:
        param = ["user1", "password"]
        check(i,param)
    elif i==13:
        param = ["tt0000929"]
        check(i,param)
    elif i==14:
        param = ["nm0000123"]
        check(i,param)
    elif i==15:
        param = ["Hen"]
        check(i,param)   
    elif i==16:
        param = ["Federico"]
        check(i,param)  
    elif i==17:
        param = ["Action", "5", "1990", ""]
        check(i,param)  