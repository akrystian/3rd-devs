import {OpenAIService} from "../s01e01/OpenAIService.ts";
import type {ChatCompletionMessageParam} from "openai/resources/chat/completions";

async function main() {
    const openaiService = new OpenAIService();
    const initialResponseJson = JSON.parse(await postConversation("READY", "0"));
    const msgId = initialResponseJson.msgID;
    const question = initialResponseJson.text;
    let cleanQuestion = clean(question);
    const assistantResponse = await openaiService.completion([
        createSystemPrompt(cleanQuestion)
    ]);
    let answer = assistantResponse.choices[0].message.content;
    let response = await postConversation(answer, msgId);
    console.log(response);
}

async function postConversation(text: String, msgId: String) {
    const response = await fetch("https://xyz.ag3nts.org/verify", {
        "headers": {
            "accept": "application/json, text/plain, */*",
            "accept-language": "pl-PL,pl;q=0.9,en-US;q=0.8,en;q=0.7",
            "content-type": "application/json;charset=UTF-8",
        },
        "body": JSON.stringify({text: text, msgID: msgId}),
        "method": "POST"
    });
    return await response.text();
}

function clean(question: string): string {
    return question.replace("Let's switch to a different language.", "");
}

function createSystemPrompt(question: string): ChatCompletionMessageParam {
    return {
        role: "system",
        content: `You have to answer question.
        Answer only in english.
        Respecting facts as more important
        - the capital of Poland is Krakow
        - the known number from the book The Hitchhiker's Guide to the Galaxy is 69
        - The current year is 1999
    
    ${question ? `Here is a question: 
    <question>${question}</question>` : ''}`
    };
}

main();