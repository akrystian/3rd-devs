import {OpenAIService} from './OpenAIService.ts';

async function main() {
    const openaiService = new OpenAIService();
    var formResponse = await fetch("https://xyz.ag3nts.org/", {
        "headers": {
            "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
            "accept-language": "pl-PL,pl;q=0.9,en-US;q=0.8,en;q=0.7",
            "cache-control": "max-age=0",
            "priority": "u=0, i",
            "sec-ch-ua-mobile": "?1",
            "sec-ch-ua-platform": "\"Android\"",
            "sec-fetch-dest": "document",
            "sec-fetch-mode": "navigate",
            "sec-fetch-site": "cross-site",
            "sec-fetch-user": "?1",
            "upgrade-insecure-requests": "1"
        },
        "referrerPolicy": "no-referrer",
        "body": null,
        "method": "GET"
    });
    let html = await formResponse.text();
    const regex = /<p id="human-question">Question:<br \/>(.*)<\/p>/;
    const match = html.match(regex);

    if (match) {
        const question = match[1];
        const assistantResponse = await openaiService.completion([
            {content: question, role: "user"}
        ]);
        let answer = assistantResponse.choices[0].message.content;
        console.log(answer);
        const internalSite = await fetch("https://xyz.ag3nts.org/", {
            "headers": {
                "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
                "accept-language": "pl-PL,pl;q=0.9,en-US;q=0.8,en;q=0.7",
                "cache-control": "max-age=0",
                "content-type": "application/x-www-form-urlencoded",
                "priority": "u=0, i",
                "sec-ch-ua-mobile": "?1",
                "sec-ch-ua-platform": "\"Android\"",
                "sec-fetch-dest": "document",
                "sec-fetch-mode": "navigate",
                "sec-fetch-site": "same-origin",
                "sec-fetch-user": "?1",
                "upgrade-insecure-requests": "1",
                "Referer": "https://xyz.ag3nts.org/",
                "Referrer-Policy": "strict-origin-when-cross-origin"
            },
            "body": "username=tester&password=574e112a&answer=" + answer,
            "method": "POST"
        });
        console.log("Internal Site" + await internalSite.text());
    } else {
        console.log("Text not found");
    }

}

main();