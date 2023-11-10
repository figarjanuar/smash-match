import { defineStore } from 'pinia'

export const useSawStore = defineStore('saw', {
  state: () => ({
    criteria: {
      experience: {
        howLong: 0.2,
        playPerWeek: 0.1,
        isCompe: 0.1
      },
      fisik: {
        height: 0.05,
        weight: 0.05,
        strength: 0.1,
        endurance: 0.1,
        playTime: 0.05
      },
      technical: {
        forehand: 0.1,
        backhand: 0.1,
        service: 0.1,
        ballReturn: 0.1,
        smash: 0.1,
        drop: 0.1,
        speed: 0.05,
        accuracy: 0.05,
        rule: 0.05
      },
      equipment: {
        racket: 0.15,
        strings: 0.05,
        shoes: 0.05,
        shirt: 0.05
      },
      achievements: {
        tournaments: 0.2,
        club: 0.2 
      }
    }
  }),
  actions: {
    generateScore(playerData) {
      const totalScore = {};
      console.log(playerData)
      for (const category in this.criteria) {
        const categoryCriteria = this.criteria[category];
        let categoryScore = 0;
        for (const criterion in categoryCriteria) {
          categoryScore += parseInt(playerData[category][criterion]) * categoryCriteria[criterion];
        }
        totalScore[category] = categoryScore;
        console.log(totalScore[category]);
      }

      let playerTotalScore = 0;
      for (const category in totalScore) {
        playerTotalScore += totalScore[category];
      }

      return playerTotalScore;
    }
  }
})