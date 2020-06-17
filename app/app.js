// Generic Strings


// Global Data
var dummy_example = {
    name: "Dummy Example",
    description: "This is a dummy program for initialization.",
    platform: "N/A",
    filepath: "./bin/dummypath.bin"
}

var data = { 
    platforms: [],
    examples: [],
    no_device: true,
    sel_platform: null,
    sel_example: dummy_example,
}

// Global Buffer for reading files
var buffer

// Reads examples.json providing the data for all precompiled examples
function gatherExampleData()
{
    var raw = new XMLHttpRequest();
    var fname = '../bin/examples.json';
    raw.open("GET", fname, true);
    raw.responseType = "text"
    raw.onreadystatechange = function ()
    {
        if (this.readyState === 4 && this.status === 200) {
            var obj = this.response; 
            buffer = JSON.parse(obj);
        }
    }
    raw.send(null)
}

function readServerFirmwareFile(path)
{
    var raw = new XMLHttpRequest();
    var fname = path;
    raw.open("GET", fname, true);
    raw.responseType = "arraybuffer"
    raw.onreadystatechange = function ()
    {
        if (this.readyState === 4 && this.status === 200) {
            var obj = this.response; 
            buffer = obj
        }
    }
    raw.send(null)
}

var app = new Vue({
    el: '#app',
    template: 
    `
    <div>
    <button id="detach" disabled="true" hidden="true">Detach DFU</button>
    <button id="upload" disabled="true" hidden="true">Upload</button>

    <h1>Electrosmith Programmer for Daisy</h1>
    <p>USB Programmer for Firmware updates on Daisy product line.</p>

    <form id="configForm">
    <p> <label for="transferSize"  hidden="true">Transfer Size:</label>
    <input type="number" name="transferSize"  hidden="true" id="transferSize" value="1024"></input> </p>
    <p> <span id="status"></span> </p>

    <p><label hidden="true" for="vid">Vendor ID (hex):</label>
    <input hidden="true" list="vendor_ids" type="text" name="vid" id="vid" maxlength="6" size="8" pattern="0x[A-Fa-f0-9]{1,4}">
    <datalist id="vendor_ids"> </datalist> </p>

    <div id="dfuseFields" hidden="true">
          <label for="dfuseStartAddress" hidden="true">DfuSe Start Address:</label>
          <input type="text" name="dfuseStartAddress" id="dfuseStartAddress"  hidden="true" title="Initial memory address to read/write from (hex)" size="10" pattern="0x[A-Fa-f0-9]+">
          <label for="dfuseUploadSize" hidden="true">DfuSe Upload Size:</label>
          <input type="number" name="dfuseUploadSize" id="dfuseUploadSize" min="1" max="2097152" hidden="true">
    </div>
</form>

    <p> Connect to the Daisy - Follow the steps in Usage section below </p>
    <button id="connect"> Connect</button>
    <br/>

    <dialog id="interfaceDialog">
      Your device has multiple DFU interfaces. Select one from the list below:
      <form id="interfaceForm" method="dialog">
        <button id="selectInterface" type="submit">Select interface</button>
      </form>
    </dialog>

    <div id="usbInfo" hidden="true" style="white-space: pre"></div>
    <div id="dfuInfo"  hidden="true" style="white-space: pre"></div>

    <p> Select a platform and a program from the menu below.</p>
    <select v-model="sel_platform" textContent="Select a platform" id="platformSelector">
        <option v-for="platform in platforms" :value="platform">{{platform}}</option>
    </select>
    <select v-model="sel_example" id="firmwareSelector" required @change="programChanged">
        <option v-for="example in platformExamples" :value="example">{{example.name}}</option>
    </select>
    <br/>
    <p> Or Select a file from your computer</p>
    <p>
        <input type="file" id="firmwareFile" name="file" disabled="true"/>
    </p>

    <br/>
    <button id="download" :disabled="!sel_platform || !sel_example || no_device"> Program</button>
    <div class="log" id="downloadLog"></div>
    <br/>
    <p> Ready to program: </p>
    <ul> 
        <li>Name: {{sel_example.name}}</li>
        <li>Description: {{sel_example.description}}</li>
        <li>File Location: {{sel_example.filepath}} </li>
    </ul>
    <h2>Usage:</h2>
    <ol>
        <li><p>Connect the Daisy to the Computer</p></li>
        <li><p>Enter the system bootloader by holding the BOOT button down, and then pressing, and releasing the RESET button.</p></li>
        <li><p>Click the Connect button at the top of the page.</p></li>
        <li><p>Select, "DFU in FS Mode"</p></li>
        <li><p>Select the "@Internal Flash" option from the dialog.</p></li>
        <li>
            <p>Now do either of the following:</p>
            <ul>
                <li><p>Select a platform and an example from the drop down menu (descriptions, diagrams, etc. coming soon)</p></li>
                <li><p>Click the Choose File button, and select the .bin file you would like to flash. This can be found in a projects "build" folder.</p></li>
            </ul>
        </li>
        <li><p>Click Program, and wait for the progress bar to finish.</p></li>
        <li><p>Now, if the program does not start immediatley, pressing RESET on the Daisy will cause the program to start running.</p></li>
    </ol>
    <p>
        On windows, you may have to update the driver to libusb.

        To do this, you can download the free software, Zadig. Instructions for this can be found on the DaisyWiki in the Windows toolchain instructions page.
    </p>
    <h1>About</h1>
    <p>
        This is a programming interface for the Daisy Platform.
    </p>
    <p>
        So long as the Daisy is using the system-bootloader (accessed by holding BOOT and pressing RESET 
        -- BOOT can be released once RESET has been released) the Daisy will show up as "DFU in FS Mode"
    </p>
    <p> Features to come: </p>
    <ul>
        <li><p>Not having to press reset at the end of the programming</p></li>
        <li><p>Better connection status (not having to select internal flash vs option bytes, etc.</p></li>
        <li><p>Custom Bootloader that will allow access to external FLASH, etc.</p></li>
    </ul>
    <h1>Prerequisites</h1>
    <p>In order to use this, you will need:</p>
    <ul>
      <li>
        <p>An up-to-date version of Chrome, at least version 61 or newer</p>
      </li>
      <li>
        <p>A Daisy Seed SOM. (The user-uploaded binary will work for any STM32 chip with a built in DFU bootloader).</p>
      </li>
    </ul>
    </div>
    `,
    data: data,
    computed: {
        platformExamples: function () {
        	
            return this.examples.filter(example => example.platform === this.sel_platform)
        }
    },
    created() {
        console.log("Page Created")
    },
    mounted() {
        var self = this
        console.log("Mounted Page")
        gatherExampleData()
        setTimeout(function(){
            self.importExamples(buffer)
        }, 250)
            
    },
    methods: {
        importExamples(data) {
            var self = this
            const unique_platforms = [...new Set(data.map(obj => obj.platform))] 
            self.examples = data
            self.platforms = unique_platforms
        },
        programChanged(){
        	var self = this
        	// Read new file
        	readServerFirmwareFile(self.sel_example.filepath)
        	setTimeout(function(){
        		firmwareFile = buffer
        	}, 500)
        }
    }
})
