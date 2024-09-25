import { Controller, Delete, Get, Patch, Post, Put, Render, Res, Param, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';
import { quotes } from './quotes';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("quotes")
  @Render('quotes')
  getHello() {
    return {
      message: quotes.quotes
    };
  }

  @Get("randomQuote")
  @Render("random")
  randomquote(){
    const randomNumber = Math.floor(Math.random() * quotes.quotes.length) + 1;
    return{
      message2:quotes.quotes[randomNumber].quote
    }
  }

  @Get("top")
  @Render("top")
  top(){
    let alma=new Map();
    quotes.quotes.forEach(element=>{
      if(alma.has(element.author)){
        alma[element.author]+=1;
      }
      else{
        alma.set(element.author, 1)
      }
    })

    return {
      message3:new Map([...alma.entries()].sort((a, b) => b[1] - a[1]))

    };
  }

  @Get('quotes/:id')
  @Render("oneQuote")
  oneQuote(@Param('id') id: string) {
    const quote = quotes.quotes.find(q => q.id.toString() === id);
    
    if (!quote) {
      return { message: 'Quote not found' };
    }
    return { message: quote.quote };
  }

  @Get("deleteQuote/:id")
  @Render("deleteQuote")
  @Delete("deleteQuote/:id")
    deleteQuote(@Param('id') id: string) {
      const quoteIndex = quotes.quotes.findIndex(q => q.id.toString() === id);

      if (quoteIndex === -1) {
        return { message: 'Quote not found' };
      }
      const deletedQuote = quotes.quotes.splice(quoteIndex, 1);

      return { message: `Quote '${deletedQuote[0].quote}' has been deleted.` };
    }

  @Get("search")
  @Render("kereses")
  idezetkeres(@Query('keres') keres:string){
    if(!keres || keres.trim().length<1){
      return{
        message: "Nincs szöveg megadva"
      }
    }
    const result = quotes.quotes.filter((element) =>
      element.quote.toLowerCase().includes(keres.toLowerCase())
    );
    let szoveg:string[]=[]
    result.forEach(element => {
      szoveg.push(element.quote)
    });
      if(szoveg.length<1){
        return{
          message: ["Nincs ilyen idézet részlet"]
          }
      }
      else{
        return{
          message: szoveg
        }
      }
  }

  @Get("highlight/:id")
  @Render("highlight")
  highlight(@Query("kiemel") kiemel:string, @Param('id') id: string){
    const kiemelt=quotes.quotes[id]
    const szoveg = `${kiemelt.author}: <b>${kiemelt.quote}</b>`;
    return{
      message: szoveg
    }
  }
}
