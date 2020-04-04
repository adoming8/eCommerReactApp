import React, { Component } from 'react'
import ParticlesBg from "particles-bg";
import { ProductConsumer } from "../contextApi";
import { Link } from "react-router-dom";
import { ButtonStyle } from "../components/ButtonStyle";

export default class Home extends Component {
    render() {
        let config = {
            num: [4, 7],
            rps: 0.1,
            radius: [5, 40],
            life: [1.5, 3],
            v: [2, 3],
            tha: [-40, 40],
            // body:'../logo512.png',
            alpha: [0.6, 0],
            scale: [.1, 0.4],
            position: "center",
            color: ["random", "#ff0000"],
            cross: "dead",
            // emitter: "follow",
            random: 15
          };
      
          if (Math.random() > 0.85) {
            config = Object.assign(config, {
              onParticleUpdate: (ctx, particle) => {
                ctx.beginPath();
                ctx.rect(
                  particle.p.x,
                  particle.p.y,
                  particle.radius * 2,
                  particle.radius * 2
                );
                ctx.fillStyle = particle.color;
                ctx.fill();
                ctx.closePath();
              }
            });
          }
        return (
          <ProductConsumer>
            {value => {
              const {
                id,
                inCart
              } = value.detailProduct;
              return (
                <div className="container py-5">         
                      <ButtonStyle
                      className='cartBtn'
                      style={CartBtnStyle}
                      disabled = {inCart ? true : false}
                      onClick = {() => {
                        value.openSUModal();
                      }}
                      >Sign Up
                      </ButtonStyle>
                    </div>
              );
            }}
          </ProductConsumer>
        );
    }
}


export const CartBtnStyle = {
  borderColor: 'var(--mainYellow)',
  color: 'var(--mainYellow)',
  hover:{
    background: "var(--mainYellow)"
  }
}

