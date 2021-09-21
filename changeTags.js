const fs = require('fs')
const puppeteer = require('puppeteer')
const credentials = require('./credentials/credentials.json')
const cookies = require('./credentials/cookies.json')
const candidatesPage = 'https://recruit.zoho.com/recruit/org644359250/ShowTab.do?isSearch=false&module=Candidates&cvid=393718000000112160&filters=%5B%7B%22searchfieldtype%22%3A%22picklist%22%2C%22searchfield%22%3A%22CrmLeadDetails%3ASTATUS%22%2C%22searchModule%22%3A%22Leads%22%2C%22condition%22%3A%220%22%2C%22value%22%3A%22Associated%22%7D%2C%7B%22searchfieldtype%22%3A%22MPL%22%2C%22searchfield%22%3A%22CrmLeadDetails%3ATAGS%22%2C%22searchModule%22%3A%22Leads%22%2C%22condition%22%3A%223%22%2C%22value%22%3A%22.NET%2C.NET%20Core%2C1st%20follow-up%2CABAP%2CBE-JS-Node%2CFE-JS-React%2CGoLang%2CNOPATT%20(no%20open%20position%20at%20the%20time)%2CPython%2CQA%2CQA%20Automation%2CQA-AU%2CQA-AU-Appium%2CQA-AU-Cucumber%2CQA-AU-Cypress%2Cqa-au-java%2CQA-AU-Selenium%2CReact%20Native%2Cdevops%2Cinf%2Cux%2Creact%2Cjava%2Cfs-js%2Cdata%2Cangular%2Candroid%2Cbackend%2Cbe%22%7D%2C%7B%22searchfieldtype%22%3A%22U%22%2C%22searchfield%22%3A%22CrmLeadDetails%3ASMCREATORID%22%2C%22searchModule%22%3A%22Leads%22%2C%22condition%22%3A%220%22%2C%22value%22%3A%22393718000004459003%22%7D%5D&submodule=Candidates'

async function initialize() {

    // launch application
    let browser = await puppeteer.launch({ headless: false, defaultViewport: null, args: ['--start-maximized'] })
    let page = await browser.newPage()

    /*====== adjust scree size ======*/
    await greaterMonitorView()
    // await mediumMonitorView()
    // await notebookSizeView()



    /*    functions to be executed    */

    await standardConfigurations()

    await login()

    await changeTags()

    await browser.close()

    /*   End of the functions   */

    /*   below is the base script   */


    /* UNIQUE FUNCTIONS */

    async function login() {
        if (Object.keys(cookies).length) { loginWithCookies() }
        else { loginWithoutCookies() }



        // 🔽 below is the documentation 🔽

        async function loginWithCookies() {

            const cookiesString = await fs.readFile('./credentials/cookies.json', function (err) { if (err) return console.log(err) });
            await page.setCookie(...cookies);
            await page.goto(candidatesPage, { waitUntil: 'networkidle0' })

        }

        async function loginWithoutCookies() {

            await page.goto(candidatesPage, { waitUntil: 'networkidle0' })

            await insertCredentials()

            await storeCookies()

        }


        async function insertCredentials() {

            // 1 insert login info
            await page.type('#login_id', credentials.email, { delay: 30 })

            // 2 Click next  Button
            await page.click('#nextbtn')

            // 3 insert password info
            await page.type('#password', credentials.password, { delay: 30 })

            // 4 Click login  Button
            await page.click('#nextbtn')

            // 7 Wait For Navigation To Finish
            await page.waitForNavigation({ waitUntil: 'networkidle0' })

        }

        async function storeCookies() {

            const cookies = await page.cookies()
            await fs.writeFile('./credentials/cookies.json', JSON.stringify(cookies, null, 2), function (err) { if (err) return console.log(err) })

        }
    }

    async function changeTags() {

        await page.waitForSelector(".list-profile-image.list-Leads-size")
        let candidateList = await page.evaluate(`document.querySelectorAll('[class="list-profile-image list-Leads-size"]').length`)
        console.log(candidateList)

        for (let i = 0; i < candidateList; i++) {
            console.log(i)

            // click name of candidate
            await page.evaluate(`document.querySelectorAll('a[data-cid="detailView"]')[0].click()`)

            await ThreeSeconds()
            await ThreeSeconds()

            // delete tag
            await page.click('.zrc-icon-close.tranSP8', function (error) { console.log(error) })

            await ThreeSeconds()

            // click confirm
            await page.evaluate(`document.querySelector('[class="zrc-btn-negative"]').click()`)
            await ThreeSeconds()

            // click add tag
            await page.evaluate(`document.querySelector('[class="addNewIcP dvp-associate dIB mL10 fR cP"]').click()`)
            await TwoSeconds()

            // text field
            await page.type('[class="qstt-edittag"]', 'Be-JS-Node', { delay: 10 })
            await page.keyboard.press("Enter")

            // add button
            await page.evaluate(`document.querySelector('[class="primarybtn submit fR"]').click()`)
            await TwoSeconds()

            // return to candidates list page
            await page.goto(candidatesPage, { waitUntil: 'networkidle0' })

        }





    }




    async function standardConfigurations() {

        await page.setDefaultNavigationTimeout(0)
        const context = browser.defaultBrowserContext()
        context.overridePermissions('https://recruit.zoho.com/recruit/org4314466/ImportParser.do?module=Candidates&type=importfromdocument', ['geolocation', 'notifications']) // An array of permissions
    }


    async function storeCookies() {

        await console.log(page.cookies())
        await console.log(page.cookies)
        const cookies = await page.cookies();
        await fs.writeFile('./configs/cookies.json', JSON.stringify(cookies, null, 2));

    }

    async function OneSecond() {

        const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))
        const element = async () => {
            await sleep(1000)

        }

        await element()

    }

    async function TwoSeconds() {
        await OneSecond()
        await OneSecond()
    }

    async function ThreeSeconds() {
        await OneSecond()
        await OneSecond()
        await OneSecond()
    }

    async function greaterMonitorView() {
        await page.setViewport({ width: 1880, height: 920, deviceScaleFactor: 1, })

    }

    async function mediumMonitorView() {
        await page.setViewport({ width: 1300, height: 650, deviceScaleFactor: 1, })

    }

    async function notebookSizeView() {
        await page.setViewport({ width: 1240, height: 650, deviceScaleFactor: 1, })


    }

}

initialize()