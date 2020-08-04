// Generic Strings
const root_url = "https://electro-smith.github.io/Programmer"

var data = { 
    platforms: [],
    examples: [],
    no_device: true,
    sel_platform: null,
    sel_example: null,
    firmwareFile: null,
    displayImportedFile: false,
    displaySelectedFile: false
}

// Global Buffer for reading files
var buffer

// Gets the root url
// should be https://localhost:9001/Programmer on local
// and https://electro-smith.github.io/Programmer on gh-pages
function getRootUrl() {
    var url = document.URL;
    return url;
}

// Reads the specified file containing JSON example meta-data
function gatherExampleData(fpath)
{
    var raw = new XMLHttpRequest();
    raw.open("GET", fpath, true);
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


function displayReadMe(fname)
{
    var url = "https://raw.githubusercontent.com/electro-smith/" + self.data.sel_example.url + "/master"
    if (self.data.sel_example.url == "DaisySP"){
        url += "/examples"
    }
    
    fname   = fname.substring(5,fname.length-4);
    url     = url + fname + "/README.md";
    
    div = document.getElementById("readme")

    marked.setOptions({
	renderer: new marked.Renderer(),
	highlight: function(code, language) {
	    const validLanguage = hljs.getLanguage(language) ? language : 'plaintext';
	    return hljs.highlight(validLanguage, code).value;
	},
	pedantic: false,
	gfm: true,
	breaks: false,
	sanitize: false,
	smartLists: true,
	smartypants: false,
	xhtml: false
    });
    
    
    fetch(url)
	.then(response => response.text())
    	.then(data => div.innerHTML = marked(data));
};


function readServerFirmwareFile(path)
{
    var raw = new XMLHttpRequest();
    var fname = path;

    displayReadMe(fname)

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
    <b-container class="app_body">
    <b-navbar type="dark" variant="dark">
    <b-navbar-brand href="#">Daisy Programmer</b-navbar-brand>
    <b-navbar-nav class="ml-auto">
    <p>USB Programmer for Firmware updates on the Daisy product line.</p>
    </b-navbar-nav>

    </b-navbar>
    <div align="center">
        <button id="detach" disabled="true" hidden="true">Detach DFU</button>
        <button id="upload" disabled="true" hidden="true">Upload</button>
        <b-form id="configForm">
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
        </b-form>
    </div>
    <b-row align="center" class="app_column">
        <div>
            <legend>Usb Programmer</legend>
            <p> Connect to the Daisy - If this is your first time here, follow the steps in Usage section below </p>
            <p><b-button variant="es" id="connect"> Connect</b-button></p>
            <dialog id="interfaceDialog">
                Your device has multiple DFU interfaces. Select one from the list below:
                <b-form id="interfaceForm" method="dialog">
                    <b-button id="selectInterface" type="submit">Select interface</b-button>
                </b-form>
            </dialog>
            <div id="usbInfo" hidden="true" style="white-space: pre"></div>
            <div id="dfuInfo"  hidden="true" style="white-space: pre"></div>
            <div>
                <b-button variant="es" v-b-toggle.collapseRequirements>Display Requirements</b-button>
                <b-button variant="es" v-b-toggle.collapseUsage>Display Usage</b-button>
                <b-collapse id="collapseUsage">
                    <div class="nested_list">
                        <h2>Usage:</h2>
                        <ol>
                            <li><p>Connect the Daisy to the Computer</p></li>
                            <li><p>Enter the system bootloader by holding the BOOT button down, and then pressing, and releasing the RESET button.</p></li>
                            <li><p>Click the Connect button at the top of the page.</p></li>
                            <li><p>Select, "DFU in FS Mode"</p></li>
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
                    </div>
                </b-collapse>
                <b-collapse id="collapseRequirements">
                    <div class="nested_list">
                        <h1>Requirements</h1>
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
                </b-collapse>
            </div>
        </div>
        </b-row>
        <b-row align="between">
        <b-col align="stretch" class="app_column">
        <b-container>
            <legend> Program Select/Import </legend>
            <b-row class="p-2">
                <legend> Select a platform and a program from the menu below.</legend>
                <b-form-select placeholder="Platform" v-model="sel_platform" textContent="Select a platform" id="platformSelector">
                    <template v-slot:first>
                        <b-form-select-option :value="null" disabled>-- Platform --</b-form-select-option>
                    </template>
                    <option v-for="platform in platforms" :value="platform">{{platform}}</option>
                </b-form-select>
                <b-form-select v-model="sel_example" id="firmwareSelector" required @change="programChanged">
                    <template v-slot:first>
                        <b-form-select-option :value="null" disabled>-- Example --</b-form-select-option>
                    </template>
                    <b-form-select-option v-for="example in platformExamples" v-bind:key="example.name" :value="example">{{example.name}}</b-form-select-option>
                </b-form-select>
            </b-row>
            <b-row class="p-2">
                <legend> Or select a file from your computer</legend>
                <p>
                    <b-form-file
                        id="firmwareFile"
                        v-model="firmwareFile"
                        :state="Boolean(firmwareFile)"
                        placeholder="Choose or drop a file..."
                        drop-placeholder="Drop file here..."
                    ></b-form-file>
                </p>
            </b-row>
        </b-container>
        </b-col>
        <b-col align="center" cols = "7" class="app_column">
            <legend>Programming Section</legend>
            <b-button id="download" variant='es' :disabled="no_device || !sel_example"> Program</b-button>
            <div class="log" id="downloadLog"></div>            
            <br><br>
            <div v-if="sel_example||firmwareFile" >            
                <div v-if="displaySelectedFile">
                <h3 class="info">Name: {{sel_example.name}}</h3>
                <!--<li>Description: {{sel_example.description}}</li>-->
                <h3 class="info">File Location: {{sel_example.filepath}} </h3>
                </div>
            <br>
            </div>
            <div><div id = "readme"></div> </div>
            
        </b-col>
        </b-row>
    </b-row>        
    
    </b-container>
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
        var fpath = getRootUrl().concat("bin/examples.json");
        gatherExampleData(fpath)
        setTimeout(function(){
            self.importExamples(buffer)
        }, 1000)
            
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
	    self.firmwareFileName = self.sel_example.name
            this.displaySelectedFile = true;
        	readServerFirmwareFile(self.sel_example.filepath)
        	setTimeout(function(){
                firmwareFile = buffer
        	}, 500)
        },
    },
    watch: {
        firmwareFile(newfile){
            firmwareFile = null;
            this.displaySelectedFile = true;
            // Create dummy example struct
            // This updates sel_example to enable the Program button when a file is loaded
            var new_example = {
                name: newfile.name,
                description: "Imported File",
                filepath: null,
                platform: null
            }
            this.sel_example = new_example;
            let reader = new FileReader();
            reader.onload = function() {
                this.firmwareFile = reader.result;
                firmwareFile = reader.result;
            }
            reader.readAsArrayBuffer(newfile);
        }
    }
})
