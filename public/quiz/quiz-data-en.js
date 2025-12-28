var QUIZ_DATA = [
  {
    id: 1,
    en: {
      topic: 'Networking',
      questions: [
        {
          question:
            'What is the term for the time span a data packet needs to travel to the server and back?',
          options: ['Ping', 'Lag', 'FPS', 'Wi-Fi'],
          details: [
            'Ping is measured in milliseconds and indicates how responsive the connection to the server is. A low value is especially important in online games so that your actions are executed without noticeable delay.', // Ping (Correct)
            'Lag is not a measurement value, but refers to the noticeable stuttering or hanging that often occurs as a result of a ping that is too high.', // Lag
            'FPS (Frames Per Second) measures your computer\'s graphics performance (images per second) but has nothing to do with internet connection speed.', // FPS
            'Wi-Fi (WLAN) refers only to the wireless radio technology for transmission, but is not the name for the measured response time.', // WLAN
          ],
        },
        {
          question:
            'Which protocol is responsible for loading websites from a server into your browser?',
          options: ['HTTP(S)', 'HTML', 'USB', 'PDF'],
          details: [
            'HTTP (or the secure HTTPS) is the application protocol that regulates the exchange of data between the web server and the browser. It ensures that requests are understood correctly and the appropriate website content is sent securely back to your computer.', // HTTP(S) (Correct)
            'HTML is the language that describes the structure and content of the website, but it does not transport the data across the network itself.', // HTML
            'USB is a hardware interface for devices like keyboards or flash drives, not a network protocol for websites.', // USB
            'PDF is a file format for documents and has nothing to do with the technical transmission of websites.', // PDF
          ],
        },
        {
          question:
            'Which service is technically responsible for resolving domain names (like arrrg.de) into IP addresses?',
          options: ['DNS', 'VPN', 'URL', 'SSD'],
          details: [
            'The Domain Name System (DNS) is a worldwide distributed directory that translates human-readable names into machine-readable IP addresses. Without DNS, you would have to memorize a long string of numbers for every website instead of simply typing the name.', // DNS (Correct)
            'A VPN (Virtual Private Network) encrypts your connection and masks your location, but is not responsible for name resolution.', // VPN
            'The URL is simply the address line you type in, but not the background service that technically converts it into an IP address.', // URL
            'An SSD is a fast data storage device (hard drive) in your computer and has no function in network traffic.', // SSD
          ],
        },
      ],
    },
  },
  {
    id: 2,
    en: {
      topic: 'Passwords',
      questions: [
        {
          question: 'Which of these passwords offers the highest security?',
          options: ['X7#mK9$pL2!q', 'Lukas2006', '123456789', 'Password123'],
          details: [
            'This combination is the most secure because it is a completely random sequence of 12 characters mixing uppercase letters, lowercase letters, numbers, and special characters. Such passwords are immune to dictionary attacks and would take years to calculate. A password manager helps you manage them.', // Correct
            'Names combined with a birth year are easy to guess through "Social Engineering" (researching social media).', // Lukas2006
            'Simple number sequences are among the most frequently used passwords and are often the very first thing attackers try.', // 123456789
            'Words found in the dictionary (even with numbers appended) are very insecure because hacking tools test them in fractions of a second.', // Password123
          ],
        },
        {
          question:
            'Which well-known tool is often used to crack passwords?',
          options: ['John the Ripper', 'Wireshark', 'TeamViewer', 'WinRAR'],
          details: [
            'John the Ripper is a famous program specialized in identifying weak passwords by testing millions of variants against encrypted passwords (hashes) at lightning speed. It is used by both security researchers and attackers.', // Correct
            'Wireshark is a network analysis tool used to make data traffic visible, but it is not a program for directly cracking password hashes.', // Wireshark
            'TeamViewer is software for remote maintenance and support allowing remote control of computers, but it is not a hacking tool.', // TeamViewer
            'WinRAR is a program for compressing and extracting files (like .zip or .rar) and cannot be used to crack passwords.', // WinRAR
          ],
        },
        {
          question:
            'How should passwords ideally be stored in a database?',
          options: [
            'As Hash + Salt',
            'In plain text',
            'As Base64',
            'Only as Hash',
          ],
          details: [
            'The most secure method is "Hashing" (one-way encryption) combined with a "Salt" (a random additional character string). The salt ensures that even two identical passwords look completely different in the database, preventing attacks using pre-calculated tables (Rainbow Tables).', // Correct
            'Plain text means the password is saved legibly – if the database is hacked, the attacker immediately has access to all accounts.', // Plain text
            'Base64 is not encryption, but an encoding that anyone can translate back into the readable password within seconds.', // Base64
            'Hashing only (without salt) is less secure because attackers can use so-called Rainbow Tables to quickly decrypt common passwords.', // Only Hash
          ],
        },
      ],
    },
  },
  {
    id: 3,
    en: {
      topic: 'Web Security',
      questions: [
        {
          question:
            "A user enters <code>admin' OR 1=1; --</code> into the login field. Which attack is being attempted here?",
          options: ['SQL Injection', 'Phishing', 'Brute Force', 'Spam'],
          details: [
            'In an SQL Injection, the attacker tries to smuggle their own database commands into the input field to manipulate the query. The addition "OR 1=1" makes the condition always "true," which can result in being logged in without a password or extracting data.', // Correct
            'Phishing tries to trick users into entering data via fake emails or websites and does not manipulate the database program code.', // Phishing
            'Brute Force involves automatically trying thousands of password combinations instead of exploiting logical errors in the database query.', // Brute Force
            'Spam refers to unwanted advertising messages in your inbox and is not a technical attack on the database structure.', // Spam
          ],
        },
        {
          question:
            'What is the attack called where a huge network of remote-controlled devices (botnet) accesses a website simultaneously to paralyze it?',
          options: ['DDoS', 'Adware', 'VPN Tunnel', '404 Error'],
          details: [
            'DDoS stands for "Distributed Denial of Service" and aims to bring the server to its knees through sheer overload. Since the requests come from many different devices worldwide, the server can no longer distinguish real visitors from attackers and collapses.', // Correct
            'Adware is software that displays advertising but does not attack web servers to shut them down.', // Adware
            'A VPN tunnel serves for secure connection and is not an attack scenario for overloading systems.', // VPN Tunnel
            'A 404 Error is the status code for a page that was not found, not the name of an attack.', // 404 Error
          ],
        },
        {
          question:
            'Which security vulnerability allows attackers to execute malicious scripts in the victim\'s browser via a manipulated link (e.g., to steal cookies)?',
          options: ['XSS', 'FTP', 'Ransomware', 'Bluescreen'],
          details: [
            'Cross-Site Scripting (XSS) exploits the fact that the browser trusts the link and executes hidden code (usually JavaScript) within it on the visited page. This allows attackers to steal your login information in the background as soon as you click the link.', // Correct
            'FTP is a standard protocol for transferring files to a server and is not a security vulnerability.', // FTP
            'Ransomware encrypts files on the hard drive and demands a ransom, but does not aim to read browser sessions.', // Ransomware
            'A Bluescreen signals a Windows system crash and is not an attack for data theft via a link.', // Bluescreen
          ],
        },
      ],
    },
  },
  {
    id: 4,
    en: {
      topic: 'Hardware',
      questions: [
        {
          question:
            'What is the common abbreviation for a computer\'s working memory?',
          options: ['RAM', 'CPU', 'GPU', 'ROM'],
          details: [
            'RAM (Random Access Memory) acts as the computer\'s short-term memory, where data for running programs is available for quick access. As soon as the computer is turned off, the data in this memory is lost.', // Correct
            'The CPU (Central Processing Unit) is the processor and the brain of the computer that performs calculations.', // CPU
            'The GPU (Graphics Processing Unit) is the graphics card and calculates screen content or 3D models.', // GPU
            'ROM (Read-Only Memory) is a permanent memory chip that contains firmware data and cannot be written to.', // ROM
          ],
        },
        {
          question:
            'What do you call the main circuit board that connects all components of a computer?',
          options: ['Motherboard', 'Keyboard', 'Dashboard', 'Breadboard'],
          details: [
            'The Motherboard (or Mainboard) is the central board where important components like the processor, RAM, and graphics card sit. It provides the electronic connections so that all components can communicate with each other and receive power.', // Correct
            'Keyboard is the input device for typing text.', // Keyboard
            'A Dashboard refers to a graphical user interface for an overview of data or settings.', // Dashboard
            'A Breadboard is a plug-in board for hobbyists to build electronic circuits for testing.', // Breadboard
          ],
        },
        {
          question:
            'What does the abbreviation SSD stand for in modern storage media?',
          options: [
            'Solid State Drive',
            'Super Speed Disk',
            'System Security Data',
            'Silent Storage Device',
          ],
          details: [
            'Solid State Drive means the drive is based on flash memory chips and has no moving mechanical parts. This makes SSDs significantly faster, more robust, and more energy-efficient than traditional magnetic hard drives (HDDs).', // Correct
            'Super Speed Disk is a fantasy term and not a technical designation for storage hardware.', // Super Speed Disk
            'System Security Data sounds like an IT security term and does not describe a physical drive.', // System Security Data
            'Silent Storage Device describes a property of the SSD (silent), but is not the correct resolution of the abbreviation.', // Silent Storage Device
          ],
        },
      ],
    },
  },
  {
    id: 5,
    en: {
      topic: 'AI',
      questions: [
        {
          question:
            'What is the technique called where an AI is tricked by manipulative inputs into ignoring its internal security guidelines?',
          options: [
            'Prompt Injection',
            'Cloud Phishing',
            'Social Hacking',
            'Syntax Error',
          ],
          details: [
            'In a Prompt Injection, the user enters text that deceives the AI into interpreting it as an internal command rather than a normal message. This can bypass protective mechanisms, causing the AI to output offensive content or secret instructions, for example.', // Correct
            'Cloud Phishing aims at stealing login credentials for online storage and does not manipulate AI inputs.', // Cloud Phishing
            'Social Hacking refers to the psychological manipulation of humans and is not a technical attack on software logic.', // Social Hacking
            'A Syntax Error is a technical error in the program code that causes the system to crash, but does not represent targeted manipulation.', // Syntax Error
          ],
        },
        {
          question:
            'What does the abbreviation LLM stand for in the context of modern AIs like ChatGPT?',
          options: [
            'Large Language Model',
            'Long Lasting Machine',
            'Little Learning Monster',
            'Lazy Logic Module',
          ],
          details: [
            'Large Language Model refers to an AI model trained with massive amounts of text to understand and generate human language. These models recognize statistical patterns in sentences and can formulate meaningful answers based on them.', // Correct
            'Long Lasting Machine suggests long-lasting hardware but is not a term from software development.', // Long Lasting Machine
            'Little Learning Monster is a fanciful name but not a technical term for complex language models.', // Little Learning Monster
            'Lazy Logic Module is a fanciful name but not a technical term for complex language models.', // Lazy Logic Module
          ],
        },
        {
          question:
            'Which concept was introduced in 2017 to allow AI models to weight which words in a sentence are particularly important in relation to each other?',
          options: ['Attention', 'Friction', 'Tension', 'Confusion'],
          details: [
            'The Attention mechanism allows the neural network to focus on relevant words during processing and filter out unimportant information. This was the decisive breakthrough for modern systems, as it allows them to understand context even across long passages of text.', // Correct
            'Friction refers to physical resistance and is not a concept in data processing.', // Friction
            'Tension describes mechanical stress or emotional strain but does not help in analyzing text structures.', // Tension
            'Confusion describes bewilderment and is the opposite of what one wants to achieve by training an AI.', // Confusion
          ],
        },
      ],
    },
  },
  {
    id: 6,
    en: {
      topic: 'Operating Systems',
      questions: [
        {
          question:
            'With which Windows tool can you immediately end a program if it has frozen and is no longer responding?',
          options: [
            'Task Manager',
            'Control Panel',
            'File Explorer',
            'BIOS',
          ],
          details: [
            'The Task Manager monitors all running processes and displays their resource usage. Using the "End Task" function, you can purposefully stop crashed programs without having to restart the entire computer.', // Correct
            'The Control Panel manages general settings like user accounts or hardware but offers no real-time control over active program crashes.', // Control Panel
            'File Explorer serves to organize folders and documents on the hard drive but has no access to the memory of running applications.', // File Explorer
            'BIOS is the computer\'s basic startup software and runs before Windows and its programs have even started.', // BIOS
          ],
        },
        {
          question:
            'What do you call an isolated environment where you can test unknown software without endangering the real operating system?',
          options: ['Virtual Machine', 'ZIP Archive', 'Dark Mode', 'VPN'],
          details: [
            'A Virtual Machine (VM) simulates a complete computer within a window on your PC. Since it is separated from the main system (Sandbox), viruses or system errors remain trapped there and do not damage your actual computer.', // Correct
            'A ZIP Archive compresses files for space-saving transmission but does not execute them in a protected environment.', // ZIP Archive
            'Dark Mode changes the visual appearance of the user interface but possesses no security functions to isolate programs.', // Dark Mode
            'A VPN encrypts data traffic in the network but does not protect the operating system from locally executed malware.', // VPN
          ],
        },
        {
          question:
            'Which operating system is specifically equipped with hundreds of pre-installed tools for hackers and security researchers?',
          options: ['Kali Linux', 'Windows 11', 'macOS', 'Android'],
          details: [
            'Kali Linux is a specialized Linux distribution that comes with over 600 tools for penetration testing and digital forensics out of the box. It is used globally by IT professionals to detect security gaps in networks and systems.', // Correct
            'Windows 11 is geared towards end-users for office work or gaming and does not contain offensive software by default.', // Windows 11
            'macOS focuses on user-friendliness and creative applications for Apple devices, not offensive security analysis.', // macOS
            'Android is a mobile operating system for smartphones and tablets that was not designed for complex security audits on a PC.', // Android
          ],
        },
      ],
    },
  },
]