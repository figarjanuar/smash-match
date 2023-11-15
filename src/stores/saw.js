import { defineStore } from 'pinia'

export const useSawStore = defineStore('saw', {
  state: () => ({
    criteria: {
      experience: { // 0.1
        isCompe: {
          weight: 0.1,
          max: 1
        }
      },
      fisik: { //0.2
        strength: {
          weight: 0.1,
          max: 5
        },
        endurance: {
          weight: 0.06,
          max: 5
        },
        playTime: {
          weight: 0.04,
          max: 3
        }
      },
      technical: { // 0.3
        service: {
          weight: 0.05,
          max: 5
        },
        ballReturn: {
          weight: 0.05,
          max: 5
        },
        smash: {
          weight: 0.05,
          max: 5
        },
        speed: {
          weight: 0.05,
          max: 5
        },
        accuracy: {
          weight: 0.05,
          max: 5
        },
        rule: {
          weight: 0.05,
          max: 5
        }
      },
      equipment: { // 0.1
        racket: {
          weight: 0.1,
          max: 5
        }
      },
      achievements: { // 0.3
        tournaments: {
          weight: 0.1,
          max: 1
        },
        club: {
          weight: 0.2,
          max: 1
        }
      }
    }
  }),
  actions: {
    generateScore(playerData) {
      const totalScore = {};

      for (const category in this.criteria) {
        const categoryCriteria = this.criteria[category];
        let categoryScore = 0;
        for (const criterion in categoryCriteria) {
          categoryScore += parseInt(playerData[category][criterion])/categoryCriteria[criterion].max * categoryCriteria[criterion].weight;
        }
        totalScore[category] = categoryScore;
      }

      let playerTotalScore = 0;
      for (const category in totalScore) {
        playerTotalScore += totalScore[category];
      }

      return playerTotalScore*100;
    }
  }
})