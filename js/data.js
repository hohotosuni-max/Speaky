/* ============================================================
   Speaky — 학습 콘텐츠 데이터
   성인 모드 / 초등 아이 모드의 상황·문장·롤플레이 대본
   ============================================================ */
(function () {
  'use strict';

  window.SPEAKY_DATA = {
    /* ────────────────────────────────────────────────
       성인 모드
       ──────────────────────────────────────────────── */
    adult: {
      label: '성인 회화',
      emoji: '👩',
      defaultSpeed: 1,
      tutor: { name: 'Emma', emoji: '👩‍🏫' },
      topics: [
        {
          id: 'cafe',
          title: '카페 주문',
          emoji: '☕',
          subtitle: '음료·사이즈·옵션 말하기',
          phrases: [
            {
              en: 'Hi, could I get a large iced latte, please?',
              ko: '안녕하세요, 큰 아이스 라떼 하나 주세요.',
              tip: "could I get은 '쿠드아이겟'처럼 붙여 말해요. 끝에 please를 붙이면 훨씬 부드러워요."
            },
            {
              en: 'Could you make it less sweet?',
              ko: '덜 달게 만들어 주실 수 있나요?',
              tip: "make it은 '메이킷'으로 이어 발음해요. less sweet은 '레스 스위트'."
            },
            {
              en: "I'll have it for here, please.",
              ko: '매장에서 먹을게요.',
              tip: "for here는 '포 히어'. 포장은 to go / takeaway라고 해요."
            },
            {
              en: 'Can I get a refill?',
              ko: '리필 되나요?',
              tip: "refill은 '리필'이 아니라 '리:필'처럼 길게 발음해요."
            },
            {
              en: "That's all, thanks.",
              ko: '그게 다예요, 감사합니다.',
              tip: "That's all은 '댓츠 올'. 주문을 마무리할 때 딱 좋아요."
            }
          ]
        },
        {
          id: 'travel',
          title: '여행·공항',
          emoji: '✈️',
          subtitle: '체크인·탑승·입국심사',
          phrases: [
            {
              en: "I'd like to check in for my flight to Paris.",
              ko: '파리행 항공편 체크인하고 싶어요.',
              tip: "I'd like to는 '아이드 라이크 투'로 부드럽게. check in은 '체킨'으로 붙여요."
            },
            {
              en: 'Could I have an aisle seat, please?',
              ko: '복도 쪽 좌석으로 주시겠어요?',
              tip: "aisle은 '아일'이라고 읽어요. window seat은 '윈도우 시트'."
            },
            {
              en: 'Where is the boarding gate for this flight?',
              ko: '이 항공편 탑승구가 어디예요?',
              tip: 'boarding gate는 \'보딩 게이트\'. Where is ~로 시작하면 길을 물을 수 있어요.'
            },
            {
              en: "I'm here for sightseeing for five days.",
              ko: '5일 동안 관광하러 왔어요.',
              tip: "sightseeing은 '사이트시잉'. 입국심사에서 자주 쓰는 표현이에요."
            },
            {
              en: 'My flight was delayed, so I missed my connection.',
              ko: '비행기가 지연돼서 환승을 놓쳤어요.',
              tip: "was delayed는 '워즈 딜레이드', connection은 '커넥션'."
            }
          ]
        },
        {
          id: 'hotel',
          title: '호텔 체크인',
          emoji: '🏨',
          subtitle: '예약 확인·요청·시설',
          phrases: [
            {
              en: 'Hi, I have a reservation under the name Kim.',
              ko: '안녕하세요, 김 이름으로 예약했어요.',
              tip: "under the name ~은 '언더 더 네임'으로 이어 말해요."
            },
            {
              en: 'Could I check in early?',
              ko: '일찍 체크인할 수 있을까요?',
              tip: 'check in early를 한 덩어리로, 끝을 살짝 올려 물음표 느낌을 주세요.'
            },
            {
              en: 'Is breakfast included?',
              ko: '조식이 포함되어 있나요?',
              tip: "included는 '인클루:디드'처럼 -ed를 또렷하게 발음해요."
            },
            {
              en: 'Could you store my luggage until this afternoon?',
              ko: '오후까지 짐을 맡아 주실 수 있나요?',
              tip: 'store my luggage는 \'스토어 마이 러기지\'. luggage는 셀 수 없는 명사예요.'
            },
            {
              en: "The air conditioner in my room isn't working.",
              ko: '제 방 에어컨이 작동하지 않아요.',
              tip: "isn't working은 '이즌 워킹'으로 자연스럽게 이어요."
            }
          ]
        },
        {
          id: 'pharmacy',
          title: '병원·약국',
          emoji: '💊',
          subtitle: '증상 설명·복용법',
          phrases: [
            {
              en: 'I have a sore throat and a slight fever.',
              ko: '목이 아프고 미열이 있어요.',
              tip: "sore throat은 '쏘어 쓰로우트'. 두 단어를 붙여 말해요."
            },
            {
              en: 'Could I get something for a headache?',
              ko: '두통약 좀 주시겠어요?',
              tip: "something for a headache는 '썸씽 포 어 헤데익'."
            },
            {
              en: 'How often should I take this?',
              ko: '이거 얼마나 자주 먹어야 해요?',
              tip: "How often은 '하우 오픈'처럼 붙여 발음해요."
            },
            {
              en: "I'm allergic to penicillin.",
              ko: '저는 페니실린 알레르기가 있어요.',
              tip: "allergic to는 '얼러직 투'. 꼭 또렷하게 말해야 하는 정보예요."
            },
            {
              en: 'Do I need a prescription for this?',
              ko: '이거 처방전이 필요한가요?',
              tip: "prescription은 '프리스크립션'. 천천히 또박또박 말해 보세요."
            }
          ]
        },
        {
          id: 'shopping',
          title: '쇼핑',
          emoji: '🛍️',
          subtitle: '사이즈·착용·환불',
          phrases: [
            {
              en: 'Do you have this in a smaller size?',
              ko: '이거 더 작은 사이즈 있나요?',
              tip: 'smaller size는 \'스몰러 사이즈\'. 비교급 -er을 살려 말해요.'
            },
            {
              en: 'Can I try this on?',
              ko: '이거 입어봐도 될까요?',
              tip: "try this on은 '트라이 디스 온'으로 이어요."
            },
            {
              en: 'How much is it with tax?',
              ko: '세금 포함해서 얼마예요?',
              tip: 'with tax는 \'위드 택스\'. 미국은 세금이 따로 붙어요.'
            },
            {
              en: "I'm just looking, thanks.",
              ko: '그냥 구경하는 중이에요, 괜찮아요.',
              tip: "just looking은 '저스트 루킹'. 점원이 다가올 때 쓰는 표현이에요."
            },
            {
              en: 'Could I get a refund for this?',
              ko: '이거 환불받을 수 있을까요?',
              tip: "refund는 '리펀드'. 환불은 refund, 교환은 exchange예요."
            }
          ]
        },
        {
          id: 'smalltalk',
          title: '일상 스몰토크',
          emoji: '💬',
          subtitle: '안부·취미·근황',
          phrases: [
            {
              en: "How's your week been?",
              ko: '이번 주는 어땠어요?',
              tip: "How's는 '하우즈'로 붙여요. been을 가볍게 붙여 주세요."
            },
            {
              en: "I've been really into hiking lately.",
              ko: '요즘 등산에 푹 빠졌어요.',
              tip: "be into ~는 '~에 빠져 있다'는 뜻이에요. into를 강조해서 말해요."
            },
            {
              en: 'That sounds like fun — tell me more.',
              ko: '재밌겠네요 — 더 얘기해 주세요.',
              tip: "sounds like fun은 '사운즈 라이크 펀'으로 이어 발음해요."
            },
            {
              en: 'Sorry, could you say that again?',
              ko: '죄송해요, 다시 한 번 말씀해 주시겠어요?',
              tip: 'say that again을 한 덩어리로. 못 들었을 때 가장 유용한 문장이에요.'
            },
            {
              en: "Let's grab a coffee sometime.",
              ko: '언제 커피 한잔해요.',
              tip: "grab a coffee는 '커피 한잔 하다'라는 캐주얼한 표현이에요."
            }
          ]
        }
      ],
      scenarios: [
        {
          id: 'cafe',
          emoji: '☕',
          title: '카페에서 주문하기',
          sub: '바리스타 Emma와 주문·결제',
          level: '초급',
          tutor: { name: 'Emma', emoji: '👩‍🍳' },
          place: 'Bean & Bloom',
          goal: '음료를 주문하고 사이즈와 옵션까지 말해보세요.',
          opening: {
            en: 'Hi there! Welcome to Bean & Bloom. What can I get started for you today?',
            ko: '어서 오세요! 오늘 어떤 걸 준비해 드릴까요?'
          },
          steps: [
            {
              hints: ['Could I get a large iced latte, please?', "I'd like an iced americano.", 'What do you recommend?'],
              branches: [
                {
                  any: ['recommend', 'what do you', 'popular', 'best'],
                  say: {
                    en: 'Of course! Our honey lavender latte is really popular, and the cold brew is great if you like it strong. Which sounds good?',
                    ko: '물론이죠! 허니 라벤더 라떼가 인기 많고, 진한 걸 좋아하시면 콜드브루도 좋아요. 어느 쪽이 끌리세요?'
                  }
                }
              ],
              say: {
                en: 'Nice choice! Would you like that hot or iced?',
                ko: '좋은 선택이에요! 뜨겁게 드릴까요, 아이스로 드릴까요?'
              },
              coach: {
                better: 'Could I get a large iced latte, please?',
                note: "'I want a latte'보다 'Could I get ~, please?'가 카페에서 가장 자연스러워요."
              }
            },
            {
              hints: ['Iced, please.', 'Hot, please — and could I get it less sweet?'],
              branches: [
                {
                  any: ['hot', 'warm'],
                  say: {
                    en: 'Got it — one hot latte. Would you like it sweet or less sweet?',
                    ko: '네, 따뜻한 라떼 하나요. 달게 드릴까요, 덜 달게 드릴까요?'
                  }
                }
              ],
              say: {
                en: "Perfect, iced it is. Would you like it sweet or less sweet?",
                ko: '좋아요, 아이스로 준비할게요. 달게 드릴까요, 덜 달게 드릴까요?'
              },
              coach: {
                better: 'Iced, please. Could you make it less sweet?',
                note: "'less sweet'은 '덜 달게'라는 뜻이에요. 완전히 빼려면 'no sugar'라고 해요."
              }
            },
            {
              hints: ['Less sweet, please.', 'Regular is fine, thank you.', 'Could I get oat milk instead?'],
              branches: [
                {
                  any: ['oat', 'almond', 'soy', 'milk'],
                  say: {
                    en: 'Sure, oat milk is one dollar extra. Can I get you anything to eat with that?',
                    ko: '네, 오트밀크는 1달러 추가예요. 같이 드실 것도 필요하세요?'
                  }
                }
              ],
              say: {
                en: 'Sounds good. Can I get you anything to eat with that?',
                ko: '좋아요. 같이 드실 것도 챙겨드릴까요?'
              },
              coach: {
                better: 'Regular is fine, thank you.',
                note: "'Regular is fine'은 '보통으로 괜찮아요'라는 뜻이에요. 짧게 대답해도 thank you를 붙이면 부드러워요."
              }
            },
            {
              hints: ["No, that's all, thanks.", 'Yes, one chocolate cookie, please.', "What's good here?"],
              branches: [
                {
                  any: ['cookie', 'cake', 'sandwich', 'food', 'bread', 'muffin'],
                  say: {
                    en: 'Great pick! That comes to 8,500 won altogether.',
                    ko: '좋은 선택이에요! 모두 8,500원이에요.'
                  }
                }
              ],
              say: {
                en: 'No problem. Your total is 6,500 won.',
                ko: '네, 총 6,500원이에요.'
              },
              coach: {
                better: "No, that's all, thank you.",
                note: "'That's all'은 주문을 마칠 때 딱 맞는 표현이에요."
              }
            },
            {
              hints: ['Card, please.', 'Can I pay with a card?', 'Here you go.'],
              branches: [
                {
                  any: ['card', 'tap', 'apple', 'pay'],
                  say: {
                    en: 'Perfect, just tap right here. All set! I’ll call your name when it’s ready.',
                    ko: '여기에 대주세요. 준비되면 이름 불러드릴게요.'
                  }
                }
              ],
              say: {
                en: 'Sure! Would you like a receipt? … All right, I’ll call your name when it’s ready.',
                ko: '네! 영수증 필요하세요? … 그럼 준비되면 이름 불러드릴게요.'
              },
              coach: {
                better: 'Card, please. Thank you!',
                note: '결제할 때는 방금 배운 카페 표현처럼 짧고 또렷하게 말하면 충분해요.'
              }
            }
          ],
          closing: {
            en: 'Thanks for coming! Have a great day!',
            ko: '와주셔서 감사해요! 좋은 하루 보내세요!'
          }
        },
        {
          id: 'hotel',
          emoji: '🏨',
          title: '호텔 체크인',
          sub: '프런트 Daniel과 체크인',
          level: '중급',
          tutor: { name: 'Daniel', emoji: '🧑‍💼' },
          place: 'Han River Hotel',
          goal: '예약을 확인하고 방과 조식을 요청해 보세요.',
          opening: {
            en: 'Good evening, welcome to the Han River Hotel. Do you have a reservation with us?',
            ko: '안녕하세요, 한강 호텔입니다. 예약하셨나요?'
          },
          steps: [
            {
              hints: ['Yes, I have a reservation under the name Kim.', 'Hi, I booked a room for two nights.', "Yes — it's under Kim Sua."],
              branches: [
                {
                  any: ['no', 'not yet', 'walk in'],
                  say: {
                    en: 'No problem at all. Let me see what we have available tonight. How many nights will you be staying?',
                    ko: '전혀 문제없어요. 오늘 밤 가능한 방을 확인해 볼게요. 몇 박 머무르실 건가요?'
                  }
                }
              ],
              say: {
                en: 'Let me check… Yes, Kim Sua, a deluxe king room for two nights. May I see your ID, please?',
                ko: '확인해 볼게요… 네, 김수아 님, 디럭스 킹룸 2박이시네요. 신분증 보여주시겠어요?'
              },
              coach: {
                better: 'Yes, I have a reservation under the name Kim.',
                note: "'under the name ~'은 '~ 이름으로 예약했다'는 뜻이에요. 호텔에서 꼭 쓰는 표현이에요."
              }
            },
            {
              hints: ['Here you are.', "Sure, here's my passport."],
              say: {
                en: "Thank you. Here's your key card — room 1208 on the twelfth floor. Would you like a room with a river view?",
                ko: '감사합니다. 카드키 드릴게요. 12층 1208호예요. 강이 보이는 방으로 바꿔드릴까요?'
              },
              coach: {
                better: 'Here you are.',
                note: '물건을 건넬 때는 "Here you are" 한마디면 충분해요.'
              }
            },
            {
              hints: ['Yes, a river view would be great.', "No, that's fine.", 'Is breakfast included?'],
              branches: [
                {
                  any: ['breakfast', '조식'],
                  say: {
                    en: 'Yes, breakfast is included — from seven to ten on the second floor. Would you like a wake-up call?',
                    ko: '네, 조식 포함이에요. 2층에서 7시부터 10시까지예요. 모닝콜을 걸어드릴까요?'
                  }
                },
                {
                  any: ['river', 'view', 'yes'],
                  say: {
                    en: "Great, I'll move you to a river-view room at no extra charge. Breakfast is from seven to ten on the second floor.",
                    ko: '네, 추가 요금 없이 강뷰 방으로 바꿔드릴게요. 조식은 2층에서 7시부터 10시까지예요.'
                  }
                }
              ],
              say: {
                en: 'Breakfast is from seven to ten on the second floor. Would you like a wake-up call?',
                ko: '조식은 2층에서 7시부터 10시까지예요. 모닝콜을 걸어드릴까요?'
              },
              coach: {
                better: 'Yes, a river view would be lovely, thank you.',
                note: "'would be lovely'는 '좋겠어요'를 부드럽게 말하는 표현이에요."
              }
            },
            {
              hints: ['No, thank you.', 'Yes, at seven, please.', 'What time is check-out?'],
              branches: [
                {
                  any: ['check out', 'checkout', 'check-out'],
                  say: {
                    en: 'Check-out is at eleven, but you can leave your luggage with us after that. Anything else I can help with?',
                    ko: '체크아웃은 11시인데, 그 이후에도 짐은 맡아드릴 수 있어요. 더 도와드릴 일 있을까요?'
                  }
                }
              ],
              say: {
                en: 'Check-out is at eleven. Is there anything else I can help you with?',
                ko: '체크아웃은 11시예요. 더 도와드릴 일이 있을까요?'
              },
              coach: {
                better: 'No, thank you. What time is check-out?',
                note: '궁금한 걸 이어서 물을 때 "What time is ~?"를 쓰면 자연스러워요.'
              }
            },
            {
              hints: ['Could you recommend a good restaurant nearby?', "No, that's all. Thank you!", 'Where is the elevator?'],
              branches: [
                {
                  any: ['elevator', 'lift'],
                  say: {
                    en: 'The elevator is just past the lobby on your right. Enjoy your stay!',
                    ko: '엘리베이터는 로비를 지나 오른쪽에 있어요. 즐거운 숙박 되세요!'
                  }
                },
                {
                  any: ['restaurant', 'eat', 'food', 'dinner', 'recommend'],
                  say: {
                    en: "There's a great Korean BBQ place just around the corner — I'll mark it on the map for you. Enjoy your stay!",
                    ko: '모퉁이만 돌면 맛있는 고깃집이 있어요. 지도에 표시해 드릴게요. 즐거운 숙박 되세요!'
                  }
                }
              ],
              say: {
                en: "You're all set. Enjoy your stay, and let us know if you need anything!",
                ko: '모두 준비됐어요. 즐거운 숙박 되시고, 필요하시면 언제든 말씀해 주세요!'
              },
              coach: {
                better: 'Could you recommend a good restaurant nearby?',
                note: '"Could you recommend ~?"는 부탁할 때 아주 자연스러운 표현이에요.'
              }
            }
          ],
          closing: {
            en: 'Thank you for staying with us. Have a wonderful evening!',
            ko: '저희 호텔을 이용해 주셔서 감사합니다. 좋은 저녁 보내세요!'
          }
        },
        {
          id: 'directions',
          emoji: '🗺️',
          title: '길 묻기',
          sub: '지나가던 Sarah에게 길을 물어요',
          level: '초급',
          tutor: { name: 'Sarah', emoji: '🧍‍♀️' },
          place: 'Downtown',
          goal: '지하철역 위치를 묻고 길을 확인해 보세요.',
          opening: {
            en: 'Oh, you look a little lost. Are you looking for something?',
            ko: '어, 길을 잃으신 것 같네요. 뭘 찾고 계세요?'
          },
          steps: [
            {
              hints: ["Yes, I'm looking for City Hall Station.", 'How do I get to the nearest subway station?', 'Do you know where the art museum is?'],
              branches: [
                {
                  any: ['museum', 'gallery', 'art'],
                  say: {
                    en: "The art museum? It's about a ten-minute walk. Go straight and turn right at the big intersection.",
                    ko: '미술관이요? 걸어서 10분쯤이에요. 직진하다가 큰 사거리에서 오른쪽으로 도세요.'
                  }
                }
              ],
              say: {
                en: "Sure! Go straight for two blocks, then turn left at the bank. You'll see the station right there.",
                ko: '네! 두 블록 직진해서 은행에서 왼쪽으로 도세요. 바로 역 입구가 보여요.'
              },
              coach: {
                better: "I'm looking for City Hall Station.",
                note: '"I\'m looking for ~"는 찾는 장소를 말할 때 가장 기본이에요.'
              }
            },
            {
              hints: ['Two blocks, then left at the bank — got it.', 'Is it far from here?', 'Could you say that again, please?'],
              branches: [
                {
                  any: ['far'],
                  say: {
                    en: "Not at all — about three minutes on foot. It's a big glass building, you can't miss it.",
                    ko: '전혀 멀지 않아요, 걸어서 3분쯤이에요. 유리로 된 큰 건물이라 금방 찾으실 거예요.'
                  }
                },
                {
                  any: ['again', 'sorry', 'repeat', 'slow'],
                  say: {
                    en: "Of course. Go straight two blocks, then turn left at the bank. It's a big glass building.",
                    ko: '물론이죠. 두 블록 직진하고 은행에서 왼쪽으로 도세요. 유리로 된 큰 건물이에요.'
                  }
                }
              ],
              say: {
                en: "Not far at all — about three minutes on foot. It's a big glass building, you can't miss it.",
                ko: '전혀 멀지 않아요, 걸어서 3분쯤이에요. 유리로 된 큰 건물이라 금방 찾으실 거예요.'
              },
              coach: {
                better: 'Two blocks, then left at the bank. Got it, thank you!',
                note: '"Got it"은 "알겠어요"를 짧고 자연스럽게 말하는 표현이에요.'
              }
            },
            {
              hints: ['Thank you so much!', 'Is there a café nearby?', 'Does the station have an elevator?'],
              branches: [
                {
                  any: ['elevator', 'lift'],
                  say: {
                    en: "Yes, there's an elevator by exit three. Have a nice day!",
                    ko: '네, 3번 출구 옆에 엘리베이터가 있어요. 좋은 하루 보내세요!'
                  }
                }
              ],
              say: {
                en: "You're welcome! Oh, and there's a nice little café right next to the station — their flat white is great.",
                ko: '천만에요! 참, 역 바로 옆에 작은 카페가 있는데 플랫화이트가 정말 맛있어요.'
              },
              coach: {
                better: "Thank you so much, you've been really helpful.",
                note: '"You\'ve been really helpful"은 도움에 대한 고마움을 크게 전하는 표현이에요.'
              }
            },
            {
              hints: ["Great, I'll check it out. Thanks!", "What's the name of the café?", 'Do you want to join me?'],
              branches: [
                {
                  any: ['name', 'called'],
                  say: {
                    en: "It's called Morrow Coffee. Tell them Sarah sent you! Enjoy your day!",
                    ko: '모로우 커피라고 해요. 사라가 보냈다고 해봐요! 좋은 하루 보내세요!'
                  }
                }
              ],
              say: {
                en: 'Enjoy your day! And if you get lost again, just ask anyone — most people speak a little English.',
                ko: '좋은 하루 보내세요! 또 길을 잃으면 아무나 물어보세요. 대부분 영어를 조금씩 해요.'
              },
              coach: {
                better: "Great, I'll check it out. Thanks for your help!",
                note: '"check it out"은 "가볼게요, 해볼게요"라는 캐주얼한 표현이에요.'
              }
            }
          ],
          closing: {
            en: 'Take care! Hope you find it easily.',
            ko: '잘 가요! 쉽게 찾으시길 바라요.'
          }
        },
        {
          id: 'pharmacy',
          emoji: '💊',
          title: '약국에서',
          sub: '약사 John에게 증상 설명',
          level: '중급',
          tutor: { name: 'John', emoji: '🧑‍⚕️' },
          place: 'City Pharmacy',
          goal: '증상을 설명하고 약 복용법을 물어보세요.',
          opening: {
            en: 'Hello! How can I help you today?',
            ko: '안녕하세요! 어떻게 도와드릴까요?'
          },
          steps: [
            {
              hints: ['I have a sore throat and a fever.', 'Could I get something for a headache?', 'I think I caught a cold.'],
              branches: [
                {
                  any: ['headache', 'head'],
                  say: {
                    en: "I'm sorry to hear that. Do you also have a fever, or just the headache?",
                    ko: '안타깝네요. 열도 있으세요, 아니면 두통만 있으세요?'
                  }
                }
              ],
              say: {
                en: "I'm sorry to hear that. How long have you had these symptoms?",
                ko: '안타깝네요. 증상이 얼마나 되셨어요?'
              },
              coach: {
                better: 'I have a sore throat and a slight fever.',
                note: '"sore throat"은 목 아픔, "slight fever"는 미열이에요.'
              }
            },
            {
              hints: ['For about two days.', 'Since yesterday.', "I'm not sure — maybe three days."],
              say: {
                en: "Thanks. I'd recommend this cold medicine — take one tablet three times a day after meals.",
                ko: '감사합니다. 이 감기약을 추천해요. 하루 세 번, 식후에 한 알씩 드세요.'
              },
              coach: {
                better: 'For about two days now.',
                note: '"for about ~"으로 기간을 말하면 자연스러워요.'
              }
            },
            {
              hints: ['How often should I take it?', 'Is it okay with other medicine?', 'Do I need a prescription?'],
              branches: [
                {
                  any: ['prescription', 'prescribe'],
                  say: {
                    en: 'No prescription needed — this one is over the counter. Take it three times a day after meals.',
                    ko: '처방전은 필요 없어요. 이건 일반의약품이에요. 하루 세 번 식후에 드세요.'
                  }
                },
                {
                  any: ['other', 'medicine', 'blood pressure'],
                  say: {
                    en: "It's fine with most medicine, but check with your doctor if you take anything for blood pressure.",
                    ko: '대부분의 약과 괜찮지만, 혈압약을 드신다면 의사와 상의하세요.'
                  }
                }
              ],
              say: {
                en: 'Three times a day, after meals, with plenty of water. No prescription needed for this one.',
                ko: '하루 세 번, 식후에 물과 함께 드세요. 이건 처방전이 필요 없어요.'
              },
              coach: {
                better: 'How often should I take it?',
                note: '"How often ~?"은 복용 횟수를 물을 때 딱 맞는 표현이에요.'
              }
            },
            {
              hints: ['Thank you. How much is it?', 'Are there any side effects?', "Okay, I'll take it."],
              branches: [
                {
                  any: ['side effect', 'sleepy', 'drowsy'],
                  say: {
                    en: 'It can make you a little sleepy, so avoid driving after taking it. It’s 9,000 won for the box.',
                    ko: '졸릴 수 있으니 드신 뒤에는 운전을 피하세요. 한 상자에 9,000원이에요.'
                  }
                }
              ],
              say: {
                en: "It's 9,000 won for the box. And it can make you a little sleepy, so avoid driving.",
                ko: '한 상자에 9,000원이에요. 그리고 졸릴 수 있으니 운전은 피하세요.'
              },
              coach: {
                better: 'Thank you. How much is it?',
                note: '"How much is it?"은 가격을 물을 때 기본 표현이에요.'
              }
            },
            {
              hints: ["Okay, I'll take it. Thank you!", 'Do you have cough drops too?', 'Can I pay by card?'],
              branches: [
                {
                  any: ['cough drop', 'cough'],
                  say: {
                    en: 'Yes, they’re right behind you on the shelf. You can pay by card at the counter.',
                    ko: '네, 뒤쪽 선반에 있어요. 계산대에서 카드로 결제하실 수 있어요.'
                  }
                }
              ],
              say: {
                en: 'Of course — you can tap your card right here. Feel better soon!',
                ko: '물론이죠, 여기에 카드 대시면 돼요. 빨리 나으세요!'
              },
              coach: {
                better: "Okay, I'll take it. Thank you!",
                note: '결정했을 때 "I\'ll take it"이라고 하면 자연스러워요.'
              }
            }
          ],
          closing: {
            en: 'Take care, and drink lots of water. Goodbye!',
            ko: '몸조리 잘하시고 물 많이 드세요. 안녕히 가세요!'
          }
        },
        {
          id: 'airport',
          emoji: '✈️',
          title: '공항 체크인',
          sub: '직원 Grace와 체크인',
          level: '중급',
          tutor: { name: 'Grace', emoji: '👩‍✈️' },
          place: 'Incheon Airport · Sky Air',
          goal: '짐을 부치고 좌석과 게이트를 확인해 보세요.',
          opening: {
            en: 'Good morning! Welcome to Sky Air. May I see your passport, please?',
            ko: '안녕하세요! 스카이항공입니다. 여권 보여주시겠어요?'
          },
          steps: [
            {
              hints: ['Here you are.', "Sure, here's my passport.", "I'd like to check in for the flight to Paris."],
              say: {
                en: 'Thank you. Are you checking in any bags today?',
                ko: '감사합니다. 부치실 짐이 있나요?'
              },
              coach: {
                better: 'Here you are.',
                note: '여권을 건넬 때 "Here you are" 한마디면 충분해요.'
              }
            },
            {
              hints: ['Yes, one suitcase.', 'Just this carry-on, thanks.', 'Two bags, please.'],
              branches: [
                {
                  any: ['carry', 'just this', 'nothing', 'no bag', 'none'],
                  say: {
                    en: 'Perfect, just a carry-on. Would you prefer a window or an aisle seat?',
                    ko: '네, 기내 수하물만이시군요. 창가석과 복도석 중 어느 쪽이 좋으세요?'
                  }
                }
              ],
              say: {
                en: 'Okay, please place it on the scale. Would you prefer a window or an aisle seat?',
                ko: '네, 저울 위에 올려주세요. 창가석과 복도석 중 어느 쪽이 좋으세요?'
              },
              coach: {
                better: 'Yes, just one suitcase.',
                note: '"just"를 붙이면 "하나뿐이에요"라는 뉘앙스가 살아요.'
              }
            },
            {
              hints: ['An aisle seat, please.', 'Window, please.', 'Either is fine.'],
              say: {
                en: 'An aisle seat it is — 24C. Your gate is 18, and boarding starts at 10:20.',
                ko: '복도석 24C로 해드릴게요. 게이트는 18번이고, 탑승은 10시 20분부터예요.'
              },
              coach: {
                better: 'An aisle seat, please.',
                note: '"aisle"은 "아일"로 발음해요. 창가석은 "window seat"이에요.'
              }
            },
            {
              hints: ['Where is gate 18?', 'Is the flight on time?', 'Thank you. Have a good day!'],
              branches: [
                {
                  any: ['on time', 'delay', 'late'],
                  say: {
                    en: "Yes, we're on schedule today. Gate 18 is at the end of this concourse, about a seven-minute walk.",
                    ko: '네, 오늘은 정시에 출발해요. 18번 게이트는 이 복도 끝에 있고 걸어서 7분쯤 걸려요.'
                  }
                }
              ],
              say: {
                en: 'Gate 18 is at the end of this concourse — about a seven-minute walk. Have a good flight!',
                ko: '18번 게이트는 이 복도 끝에 있어요. 걸어서 7분쯤 걸려요. 좋은 비행 되세요!'
              },
              coach: {
                better: 'Where is gate 18?',
                note: '"Where is ~?"로 위치를 물으면 돼요.'
              }
            }
          ],
          closing: {
            en: 'Thank you for flying with us. Have a safe trip!',
            ko: '저희 항공사를 이용해 주셔서 감사합니다. 안전한 여행 되세요!'
          }
        },
        {
          id: 'smalltalk',
          emoji: '💬',
          title: '자유 스몰토크',
          sub: '친구 Alex와 근황 이야기',
          level: '중급',
          tutor: { name: 'Alex', emoji: '🧑‍🦱' },
          place: 'Near the office',
          goal: '안부를 주고받고 주말 계획을 이야기해 보세요.',
          opening: {
            en: "Hey! Good to see you. How's your week been?",
            ko: '어! 만나서 반가워. 이번 주는 어땠어?'
          },
          steps: [
            {
              hints: ['Pretty good, thanks. It’s been busy.', 'Not bad! How about you?', 'It’s been a long week.'],
              branches: [
                {
                  any: ['busy', 'long', 'tired', 'hard', 'stress'],
                  say: {
                    en: 'I hear you — this week has been wild for me too. Any plans for the weekend?',
                    ko: '그렇지 — 나도 이번 주 정신없었어. 주말에 계획 있어?'
                  }
                }
              ],
              say: {
                en: 'Glad to hear it! Any plans for the weekend?',
                ko: '다행이다! 주말에 계획 있어?'
              },
              coach: {
                better: 'Pretty good, thanks. It’s been busy. How about you?',
                note: '안부를 받으면 "How about you?"로 되물어 주는 게 자연스러워요.'
              }
            },
            {
              hints: ["I'm going hiking with my family.", 'Nothing special — just relaxing at home.', 'I might meet a friend for coffee.'],
              branches: [
                {
                  any: ['hik', 'mountain', 'walk'],
                  say: {
                    en: "That sounds nice! Where do you usually go hiking?",
                    ko: '좋겠다! 보통 어디로 등산 가?'
                  }
                },
                {
                  any: ['coffee', 'friend', 'meet'],
                  say: {
                    en: "That sounds fun. Is it someone from work?",
                    ko: '재밌겠다. 회사 사람이야?'
                  }
                }
              ],
              say: {
                en: "Sometimes doing nothing is the best plan. I'm thinking about trying a new café this weekend.",
                ko: '아무것도 안 하는 게 제일 좋은 계획일 때도 있지. 나는 이번 주말에 새 카페에 가볼까 해.'
              },
              coach: {
                better: "I'm going hiking with my family.",
                note: '계획을 말할 때 "I\'m going to ~"나 "I\'m ~ing"를 쓰면 자연스러워요.'
              }
            },
            {
              hints: ['Oh, which café?', 'That sounds fun!', 'I love cafés.'],
              say: {
                en: "It's a tiny place near the river. They say their banana bread is amazing.",
                ko: '강 근처의 작은 가게야. 바나나 브레드가 정말 맛있다더라.'
              },
              coach: {
                better: 'Oh, which café?',
                note: '관심 있다는 걸 보여줄 때 "which ~?"로 되묻는 게 좋아요.'
              }
            },
            {
              hints: ['Banana bread? Count me in!', 'Sounds delicious. Let me know how it is.', 'Maybe we can go together.'],
              branches: [
                {
                  any: ['together', 'we', 'join', 'count me'],
                  say: {
                    en: "Yes, let's! Saturday afternoon works for me. I'll text you the address.",
                    ko: '좋지! 나는 토요일 오후가 괜찮아. 주소는 문자로 보낼게.'
                  }
                }
              ],
              say: {
                en: "I'll send you a photo. Anyway, I should run — it was great catching up!",
                ko: '사진 보내줄게. 그런데 이제 가봐야 해 — 만나서 반가웠어!'
              },
              coach: {
                better: 'Sounds delicious. Let me know how it is.',
                note: '"Let me know ~"는 "알려줘"라는 뜻으로 아주 자주 써요.'
              }
            },
            {
              hints: ['It was great catching up too!', 'See you soon!', "Let's grab a coffee next week."],
              say: {
                en: "Definitely! Let's grab a coffee next week. Take care!",
                ko: '그러자! 다음 주에 커피 한잔 하자. 잘 지내!'
              },
              coach: {
                better: "Let's grab a coffee next week.",
                note: '"grab a coffee"는 "커피 한잔 하자"라는 자연스러운 표현이에요.'
              }
            }
          ],
          closing: {
            en: 'See you around! Have a great weekend!',
            ko: '또 봐! 좋은 주말 보내!'
          }
        }
      ]
    },

    /* ────────────────────────────────────────────────
       초등 아이 모드
       ──────────────────────────────────────────────── */
    kid: {
      label: '초등 바이링구어',
      emoji: '🐥',
      defaultSpeed: 1,
      tutor: { name: 'Mia', emoji: '🧒' },
      topics: [
        {
          id: 'bookclub',
          title: 'Book Club',
          emoji: '📚',
          subtitle: '책·스토리 · 장면·캐릭터·결말',
          phrases: [
            {
              en: 'What surprised me the most was how the story ended.',
              ko: '나한테 가장 놀라웠던 건 이야기의 결말이었어.',
              tip: "감상을 꺼낼 때 'What surprised me the most was ~' 틀을 통째로 써요. surprised를 살짝 세게, the most는 길게."
            },
            {
              en: 'If I were the main character, I would have made a totally different choice.',
              ko: '내가 주인공이었다면 완전히 다른 선택을 했을 거야.',
              tip: "'If I were ~, I would have p.p.'는 책 토론에서 진짜 쓰는 가정법이에요. would have는 '우드 해브'로 붙여 말해요."
            },
            {
              en: "The author didn't tell us everything, which made the ending even more mysterious.",
              ko: '작가가 모든 걸 다 알려주지 않아서 결말이 더 신비로웠어.',
              tip: "콤마 + which는 앞 문장 전체를 받아 '그래서 ~하게 됐다'고 덧붙이는 고급 연결 방식이에요."
            },
            {
              en: 'I could really relate to the older sister because she felt left out too.',
              ko: '누나가 소외감을 느끼는 부분이 나랑 정말 비슷하게 느껴졌어.',
              tip: "relate to ~는 '~에 공감하다', feel left out은 '소외된 느낌이 들다'예요. 감정을 정확히 집어 말할 때 써요."
            },
            {
              en: 'To be honest, I liked the beginning better than the ending.',
              ko: '솔직히 나는 결말보다 처음 부분이 더 좋았어.',
              tip: "'To be honest'는 의견을 부드럽게 꺼내는 연결어예요. better than까지 붙이면 비교 근거가 한 문장에 들어가요."
            }
          ]
        },
        {
          id: 'science',
          title: 'Science & Wonder',
          emoji: '🚀',
          subtitle: '우주·과학·동물 · 왜 그런지 추론',
          phrases: [
            {
              en: "I've always wondered why the sky turns red at sunset.",
              ko: '나는 해 질 때 하늘이 왜 빨개지는지 늘 궁금했어.',
              tip: "호기심을 여는 최고의 문장 'I've always wondered why ~'. wondered는 '원더드'로 부드럽게 이어요."
            },
            {
              en: 'Scientists believe that octopuses might be even smarter than we thought.',
              ko: '과학자들은 문어가 우리가 생각했던 것보다 훨씬 똑똑할지도 모른다고 믿어.',
              tip: "might be는 '아마 ~일지도'라는 조심스러운 추측이에요. even smarter로 정도를 강조해요."
            },
            {
              en: "That's probably because their bodies are built to survive in freezing water.",
              ko: '그건 아마 그들의 몸이 얼음 같은 물에서 살아남도록 만들어졌기 때문일 거야.',
              tip: "That's probably because ~는 '그건 아마 ~ 때문일 거야'. 추론을 한 문장 더 잇는 연결어예요."
            },
            {
              en: 'What if gravity worked a little differently on another planet?',
              ko: '다른 행성에서 중력이 조금 다르게 작용한다면 어떨까?',
              tip: "What if ~?는 상상 토론을 여는 표현이에요. 가정이라 worked처럼 과거형을 써요."
            },
            {
              en: 'The more I read about space, the more curious I get.',
              ko: '우주에 대해 읽으면 읽을수록 더 궁금해져.',
              tip: "'the more ~, the more ~'는 '~할수록 더 ~'. get curious처럼 get + 형용사도 자연스러워요."
            }
          ]
        },
        {
          id: 'showtell',
          title: 'Show & Tell',
          emoji: '🎤',
          subtitle: '학교·일상 · 내가 만든 것 발표',
          phrases: [
            {
              en: 'Today I want to show you something I made all by myself.',
              ko: '오늘은 내가 혼자 다 만든 걸 보여주고 싶어.',
              tip: 'all by myself는 "혼자 힘으로". 발표 첫 문장으로 딱 좋아요.'
            },
            {
              en: "At first it didn't work at all, but then I figured out what was wrong.",
              ko: '처음엔 전혀 안 됐는데, 그러다 뭐가 잘못됐는지 알아냈어.',
              tip: "At first ~, but then ~은 이야기에 긴장을 만드는 구조예요. figure out은 '알아내다'."
            },
            {
              en: 'The funny part is that it broke two minutes after I finished it.',
              ko: '웃긴 건, 다 만들고 2분 뒤에 부서졌다는 거야.',
              tip: "'The funny part is that ~'은 웃픈 에피소드를 살려 주는 표현이에요."
            },
            {
              en: 'Then my friend showed me a trick, and it finally worked.',
              ko: '그다음 친구가 요령을 알려줬고, 드디어 됐어.',
              tip: "finally는 '드디어'. 문장 가운데 넣으면 강조가 살아요."
            },
            {
              en: "So that's the story of how I built my first robot.",
              ko: '그래서 이게 내가 첫 로봇을 만든 이야기야.',
              tip: "발표를 닫는 틀 'So that's the story of how ~'. how절로 끝내면 깔끔해요."
            }
          ]
        },
        {
          id: 'debate',
          title: 'Opinion & Debate',
          emoji: '⚖️',
          subtitle: '가벼운 토론 · 이유 대며 의견 말하기',
          phrases: [
            {
              en: 'In my opinion, a longer vacation is better than no homework.',
              ko: '내 생각엔 숙제 없는 것보다 긴 방학이 더 좋아.',
              tip: "'In my opinion'은 의견을 여는 정석이에요. better than으로 비교 근거까지 한 번에."
            },
            {
              en: 'The main reason is that we forget everything during a long break.',
              ko: '가장 큰 이유는 긴 방학 동안 배운 걸 다 잊어버린다는 거야.',
              tip: "The main reason is that ~은 '가장 큰 이유는 ~'. 이유를 대는 첫 문장으로 써요."
            },
            {
              en: 'On the other hand, having no homework gives us more time to explore.',
              ko: '반대로, 숙제가 없으면 탐험할 시간이 더 많아져.',
              tip: "On the other hand는 '반면에'. 반대 근거를 꺼낼 때 이어 붙여요."
            },
            {
              en: "I'd rather have super speed than super strength, because I could travel anywhere in a second.",
              ko: '나는 괴력보다 초스피드가 좋아, 왜냐하면 1초 만에 어디든 갈 수 있으니까.',
              tip: "I'd rather A than B는 'B보다 A가 낫다'. because로 이유까지 붙이면 완벽한 토론 문장이에요."
            },
            {
              en: 'I can see your point, but I still think differently.',
              ko: '네 말이 이해는 되는데, 그래도 난 생각이 달라.',
              tip: "I can see your point, but ~은 '네 말도 이해하지만 ~'. 정중하게 반박하는 표현이에요."
            }
          ]
        },
        {
          id: 'gameguide',
          title: 'Game Guide',
          emoji: '🎮',
          subtitle: '게임·취미 · 규칙과 전략 설명',
          phrases: [
            {
              en: 'The goal of the game is to collect as many cards as you can before time runs out.',
              ko: '이 게임의 목표는 시간이 다 되기 전에 카드를 최대한 많이 모으는 거야.',
              tip: '규칙 설명은 The goal of the game is to ~로 시작해요. as many ~ as you can은 "최대한 많이".'
            },
            {
              en: 'First, you shuffle the cards, and then everyone picks five.',
              ko: '먼저 카드를 섞고, 그다음 모두 다섯 장씩 골라.',
              tip: 'First ~, and then ~으로 순서를 설명해요. shuffle은 "섞다".'
            },
            {
              en: 'The trick is to watch what the other players are doing.',
              ko: '요령은 다른 플레이어들이 뭘 하는지 지켜보는 거야.',
              tip: "The trick is to ~는 '요령은 ~'. 전략을 설명할 때 가장 자주 쓰는 틀이에요."
            },
            {
              en: 'If you get stuck, you can trade two cards for one extra turn.',
              ko: '막히면 카드 두 장을 주고 한 번 더 할 수 있어.',
              tip: "get stuck은 '막히다', trade A for B는 'A를 주고 B를 받다'예요."
            },
            {
              en: "You should try it — it's way more fun than it looks.",
              ko: '한번 해봐 — 보기보다 훨씬 재밌어.',
              tip: "way는 비교급 앞에서 '훨씬'이에요. way more fun than ~으로 강조해요."
            }
          ]
        }
      ],
      scenarios: [
        {
          id: 'bookclub',
          emoji: '📚',
          title: 'Book Club 이야기',
          sub: '북클럽 친구 Mia와 결말·캐릭터 이야기',
          level: '중급 · 바이링구어',
          tutor: { name: 'Mia', emoji: '🧒' },
          place: 'School Book Club',
          goal: '결말과 캐릭터에 대한 내 생각을 이유와 함께 말해 보세요.',
          opening: {
            en: "Hey! You finished the book too, right? No spoilers — but what did you think of the ending?",
            ko: '안녕! 너도 그 책 다 읽었지? 스포일러는 빼고 — 결말 어떻게 생각했어?'
          },
          steps: [
            {
              hints: ['Honestly, the ending surprised me a lot.', "I didn't see that twist coming at all.", 'I loved it, but I still have so many questions.'],
              say: {
                en: 'Right? I had to read the last page twice. Which part surprised you the most?',
                ko: '그치? 나는 마지막 페이지를 두 번 읽었어. 어느 장면이 제일 놀라웠어?'
              },
              coach: {
                better: 'What surprised me the most was the twist at the very end.',
                note: "감상을 말할 때 'What surprised me the most was ~'로 시작하면 훨씬 또렷하게 들려요."
              }
            },
            {
              hints: ['What surprised me the most was that the villain was actually her brother.', 'The moment when the lights went out was the best part.', 'I was shocked when the dog disappeared.'],
              say: {
                en: 'That part was wild! And what did you think of the main character? Would you have done the same thing?',
                ko: '그 장면 진짜 충격이었지! 주인공은 어땠어? 너였으면 똑같이 했을 것 같아?'
              },
              coach: {
                better: 'What surprised me the most was that the villain turned out to be her brother.',
                note: "turn out to be ~는 '알고 보니 ~였다'. 반전을 설명할 때 원어민이 자주 써요."
              }
            },
            {
              hints: ['If I were the main character, I would have told the truth right away.', 'I could really relate to her, because she felt left out too.', 'To be honest, I thought she made a lot of bad choices.'],
              say: {
                en: "Fair enough. Why do you think the author made her keep the secret for so long?",
                ko: '그럴 만하네. 작가는 왜 그렇게 오래 비밀을 지키게 했을까?'
              },
              coach: {
                better: 'If I were the main character, I would have told the truth right away.',
                note: "'If I were ~, I would have p.p.'는 지난 일을 가정할 때 쓰는 표현이에요. 책 토론에서 아주 자연스러워요."
              }
            },
            {
              hints: ['Maybe the author wanted us to feel the way she did.', 'I think the story just needed a big twist at the end.', "Honestly, I'm not sure — the author never explains it."],
              branches: [
                {
                  any: ['not sure', "don't know", 'no idea'],
                  say: {
                    en: "That's okay — sometimes the author leaves it open on purpose. Would you still recommend this book to our class?",
                    ko: '괜찮아, 작가가 일부러 열어 두는 경우도 있으니까. 그래도 우리 반에 이 책 추천할래?'
                  }
                }
              ],
              say: {
                en: 'Hmm, I never thought of it that way. Would you recommend this book to our class?',
                ko: '음, 그렇게 생각은 못 했네. 우리 반에 이 책 추천할래?'
              },
              coach: {
                better: "I think the author wanted us to feel exactly what she felt.",
                note: 'reason을 말할 때 I think ~ wanted us to ~로 쓰면 근거가 분명해져요.'
              }
            },
            {
              hints: ['Definitely — especially if they like mystery stories.', "I'd say it's better for people who don't mind a sad ending.", "Maybe not for everyone, but I'd read it again."],
              say: {
                en: "Then let's bring it to book club on Friday. I can't wait to hear what everyone else says!",
                ko: '그럼 금요일 북클럽에 이 책을 가져오자. 다른 친구들 생각도 정말 궁금하다!'
              },
              coach: {
                better: "Definitely — especially if they like mystery stories.",
                note: "especially if ~는 '특히 ~한 사람에게'로 추천 대상을 좁혀 주는 표현이에요."
              }
            }
          ],
          closing: {
            en: 'See you at book club! Bring your favorite scene, okay?',
            ko: '북클럽에서 봐! 제일 좋아하는 장면도 준비해 와, 알겠지?'
          }
        },
        {
          id: 'science',
          emoji: '🚀',
          title: '신기한 과학 수다',
          sub: '과학을 좋아하는 친구 Leo와 호기심 토크',
          level: '중급 · 바이링구어',
          tutor: { name: 'Leo', emoji: '👦' },
          place: 'Science Club',
          goal: '궁금한 것에 대해 추측하고, 이유를 들어 설명해 보세요.',
          opening: {
            en: "Did you know octopuses have three hearts? It's been on my mind all day.",
            ko: '문어한테 심장이 세 개 있는 거 알아? 하루 종일 그 생각만 했어.'
          },
          steps: [
            {
              hints: ['Seriously? That is so weird — why would it need three?', "I've always wondered how octopuses survive in the deep sea.", "That can't be true! Where did you read that?"],
              say: {
                en: 'I read it in a science magazine. Two hearts pump blood to the gills, and one pumps it to the rest of the body. Cool, right?',
                ko: '과학 잡지에서 읽었어. 심장 두 개는 아가미로 피를 보내고, 하나는 몸 전체로 보낸대. 신기하지?'
              },
              coach: {
                better: "Seriously? That's so weird — why would it need three hearts?",
                note: "'why would it ~?'는 '왜 굳이 ~할까?'라는 뜻으로, 호기심을 드러내는 자연스러운 질문이에요."
              }
            },
            {
              hints: ['That actually makes sense, because the water is freezing down there.', 'So what happens to their hearts when they swim?', 'I have to look that up when I get home.'],
              say: {
                en: "Exactly! And here's the strange part — their heart slows down when they swim. Why do you think that is?",
                ko: '맞아! 그런데 이상한 건, 헤엄칠 때 심장이 느려진대. 왜 그럴 것 같아?'
              },
              coach: {
                better: 'That actually makes sense, because the water is freezing down there.',
                note: "make sense는 '이해가 되다'. because를 붙이면 추론이 완성돼요."
              }
            },
            {
              hints: ['Maybe they need less energy when they move slowly.', "That's probably because cold water makes their blood move differently.", "I'm not sure. What if it's because they get tired easily?"],
              branches: [
                {
                  any: ['not sure', "don't know", 'no idea', 'maybe'],
                  say: {
                    en: "Good guess! Scientists aren't sure either. If you could study one animal for a year, which would you choose?",
                    ko: '좋은 추측이야! 과학자들도 확실하진 않대. 1년 동안 동물 하나를 연구할 수 있다면 뭘 고를래?'
                  }
                }
              ],
              say: {
                en: "That's a smart guess. If you could study one animal for a year, which would you choose?",
                ko: '똑똑한 추측이야. 1년 동안 동물 하나를 연구할 수 있다면 뭘 고를래?'
              },
              coach: {
                better: "That's probably because their bodies work slower in freezing water.",
                note: "That's probably because ~로 시작하면 추측을 근거와 함께 말할 수 있어요."
              }
            },
            {
              hints: ["I'd study whales, because they can dive really deep.", "Probably ants — their teamwork is unbelievable.", "I'd pick a hummingbird, since it can fly backwards."],
              say: {
                en: 'Nice choice! What would you want to find out about them?',
                ko: '좋은 선택이야! 그 동물에 대해 뭘 알아내고 싶어?'
              },
              coach: {
                better: "I'd study whales, because they can dive really deep.",
                note: "I'd + 동사는 '~할 텐데'라는 상상 표현이에요. because로 이유를 붙여 보세요."
              }
            },
            {
              hints: ["I'd want to know how they find their way in the dark.", "I'd test how much they can remember.", "I'd love to know what they do when nobody is watching."],
              say: {
                en: "You should write that down — our science teacher loves questions like that!",
                ko: '그거 꼭 적어 둬 — 우리 과학 선생님은 그런 질문을 정말 좋아하셔!'
              },
              coach: {
                better: "I'd want to know how they find their way in the dark.",
                note: "how they ~ 처럼 의문사 + 주어 + 동사 순서를 지키면 간접의문문이 자연스러워져요."
              }
            }
          ],
          closing: {
            en: "Let's look it up together at lunch — this is going to be fun!",
            ko: '점심시간에 같이 찾아보자 — 진짜 재밌을 거야!'
          }
        },
        {
          id: 'showtell',
          emoji: '🎤',
          title: 'Show & Tell 발표',
          sub: '반 친구 Nora에게 내 이야기 발표',
          level: '중급 · 바이링구어',
          tutor: { name: 'Nora', emoji: '👧' },
          place: 'Classroom · Show & Tell',
          goal: '오늘 있었던 일이나 내가 만든 것을 순서대로 조리 있게 말해 보세요.',
          opening: {
            en: "Okay, it's your turn for show and tell! Everyone's listening — what did you bring?",
            ko: '자, 이제 네 차례야! 다들 듣고 있어 — 뭘 가져왔어?'
          },
          steps: [
            {
              hints: ['Today I want to show you something I made all by myself.', "I brought something from my grandma's garden.", "I'm going to talk about something that happened this morning."],
              say: {
                en: 'Ooh, that looks interesting! How did you come up with the idea?',
                ko: '오, 재밌어 보인다! 그 생각은 어떻게 떠올렸어?'
              },
              coach: {
                better: 'Today I want to show you something I made all by myself.',
                note: '발표 첫 문장은 all by myself까지 붙이면 훨씬 자신감 있게 들려요.'
              }
            },
            {
              hints: ['At first I just wanted to make a paper airplane, but then it turned into something bigger.', 'My little brother broke his toy, so I tried to fix it.', 'I got the idea from a video I watched last week.'],
              say: {
                en: "That's really creative. Was it hard to make? Tell us the hardest part.",
                ko: '정말 창의적이다. 만들기 어려웠어? 제일 힘들었던 부분을 말해 줘.'
              },
              coach: {
                better: 'At first I just wanted to make a paper airplane, but then it turned into something bigger.',
                note: "turn into ~는 '~로 변하다'. 계획이 바뀐 이야기를 자연스럽게 이어 줘요."
              }
            },
            {
              hints: ['The hardest part was cutting the wings the same size.', "At first it didn't work at all, but then I figured out what was wrong.", 'Honestly, the tape kept coming off, which was annoying.'],
              say: {
                en: 'I can imagine! And did it actually work when you finished it?',
                ko: '충분히 알 것 같아! 그런데 다 만들고 나서 진짜 됐어?'
              },
              coach: {
                better: "At first it didn't work at all, but then I figured out what was wrong.",
                note: "figured out what was wrong은 '뭐가 문제인지 알아냈다'. 문제 해결 이야기의 핵심 문장이에요."
              }
            },
            {
              hints: ['The funny part is that it broke two minutes after I finished it.', 'Yes! It flew all the way across the room.', 'It worked, but only if I threw it really gently.'],
              say: {
                en: "No way, that's hilarious! What would you change if you made another one?",
                ko: '말도 안 돼, 진짜 웃기다! 하나 더 만든다면 뭘 바꿀 거야?'
              },
              coach: {
                better: 'The funny part is that it broke two minutes after I finished it.',
                note: "'The funny part is that ~'은 웃긴 반전을 소개하는 표현이에요. 발표에서 분위기를 확 살려 줘요."
              }
            },
            {
              hints: ["I'd use stronger tape and make the wings wider.", "I'd ask my dad to help me with the glue.", "I'd start earlier, because it took way longer than I thought."],
              branches: [
                {
                  any: ['better', 'bigger', 'stronger', 'wider'],
                  say: {
                    en: "Good thinking — that would definitely make it stronger. I'm trying that this weekend!",
                    ko: '좋은 생각이야 — 그러면 확실히 더 튼튼해질 거야. 나도 이번 주말에 해 볼래!'
                  }
                }
              ],
              say: {
                en: "That's a great answer. I'm definitely trying that this weekend!",
                ko: '정말 좋은 대답이야. 나도 이번 주말에 꼭 해 볼래!'
              },
              coach: {
                better: "I'd use stronger tape and make the wings wider.",
                note: "'I'd + 동사'로 개선안을 말하면 발표의 마무리가 아주 깔끔해져요."
              }
            }
          ],
          closing: {
            en: 'Great job today! Now I want to make one too.',
            ko: '오늘 정말 잘했어! 이제 나도 하나 만들어 보고 싶어.'
          }
        },
        {
          id: 'debate',
          emoji: '⚖️',
          title: '의견 대결 토론',
          sub: '친구 Ethan과 이유 대며 토론',
          level: '중상급 · 바이링구어',
          tutor: { name: 'Ethan', emoji: '🧑' },
          place: 'Lunch Table Debate',
          goal: '내 의견을 말하고, 상대 의견에 정중하게 답해 보세요.',
          opening: {
            en: 'Okay, big question: if school had no homework, would it be better or worse? You go first.',
            ko: '자, 큰 질문! 학교에 숙제가 없다면 더 좋을까, 더 나쁠까? 네가 먼저 말해 봐.'
          },
          steps: [
            {
              hints: ['In my opinion, less homework would be better, because we would have more time to explore.', 'I think homework is useful, but it should be much shorter.', "Honestly, I'd keep homework and make it more interesting."],
              say: {
                en: "Interesting! But don't you think we'd forget everything if we never practiced?",
                ko: '흥미롭네! 그런데 연습을 안 하면 배운 걸 다 잊어버리지 않을까?'
              },
              coach: {
                better: 'In my opinion, less homework would be better, because we would have more time to explore.',
                note: "'In my opinion'으로 시작하고 because로 이유를 붙이면 토론 문장이 완성돼요."
              }
            },
            {
              hints: ['The main reason is that we remember more when we are not exhausted.', 'On the other hand, short practice does help us remember.', 'I can see your point, but I still think differently.'],
              say: {
                en: "Okay, fair point. So here's another one: super speed or super strength. Which would you pick, and why?",
                ko: '좋아, 인정. 그럼 다른 질문! 초스피드 아니면 괴력. 뭘 고를래? 그리고 왜?'
              },
              coach: {
                better: 'I can see your point, but I still think differently.',
                note: "'I can see your point, but ~'은 상대를 인정하면서 반박하는, 토론에서 가장 쓸모 있는 표현이에요."
              }
            },
            {
              hints: ["I'd rather have super speed, because I could travel anywhere in a second.", 'Super strength, definitely — I could help people lift heavy things.', 'Can I pick invisibility instead? It would be way more useful.'],
              say: {
                en: 'Ha! Okay, fair. But what would you actually do with it on a normal school day?',
                ko: '하! 좋아, 인정. 그런데 평범한 학교 생활에서 그걸로 진짜 뭘 할 건데?'
              },
              coach: {
                better: "I'd rather have super speed, because I could travel anywhere in a second.",
                note: "I'd rather A than B는 'B보다 A가 좋다'. because를 붙이면 설득력이 확 올라가요."
              }
            },
            {
              hints: ["I'd finish my chores in a second and then read all afternoon.", "I'd help the firefighter team lift cars out of the way.", "I'd probably just use it to get to school on time, honestly."],
              say: {
                en: "See, that's the thing — I'd use super speed to skip the bus line. Does that count as cheating?",
                ko: '보라니까 — 나는 그걸로 버스 줄을 새치기할 거야. 그거 반칙일까?'
              },
              coach: {
                better: "I'd finish my chores in a second and then read all afternoon.",
                note: '구체적인 예를 하나 붙이면 의견이 훨씬 설득력 있게 들려요.'
              }
            },
            {
              hints: ["That's definitely cheating, but I'd probably do it too.", "I don't think so — you are not hurting anyone.", 'Okay, you win this round, but only because I am hungry.'],
              say: {
                en: "Ha! Same time tomorrow, and I'm picking the topic.",
                ko: '하! 내일 같은 시간에 또 하자, 주제는 내가 고를 거야.'
              },
              coach: {
                better: "I don't think so — you are not hurting anyone.",
                note: "I don't think so는 '그렇게 생각 안 해'. 반대 의견을 부드럽게 말할 때 좋아요."
              }
            }
          ],
          closing: {
            en: 'That was a good debate. You are really hard to argue with!',
            ko: '좋은 토론이었어. 너랑은 말로 이기기 진짜 힘들다!'
          }
        },
        {
          id: 'gameguide',
          emoji: '🎮',
          title: '게임 규칙 알려주기',
          sub: '친구 Jay에게 내 게임 설명',
          level: '중급 · 바이링구어',
          tutor: { name: 'Jay', emoji: '🧒' },
          place: 'After School Club',
          goal: '규칙을 순서대로, 전략까지 곁들여 설명해 보세요.',
          opening: {
            en: "You said you'd teach me your card game — I'm ready. How do we start?",
            ko: '너가 카드 게임 알려준다며 — 준비됐어. 어떻게 시작해?'
          },
          steps: [
            {
              hints: ['The goal of the game is to collect as many cards as you can before time runs out.', 'First, you shuffle the cards, and then everyone picks five.', "It's easy once you get it — let me walk you through it."],
              say: {
                en: 'Okay, cards in my hand. So how do I know which one to play?',
                ko: '좋아, 카드는 손에 들었어. 그럼 어느 걸 내야 하는지 어떻게 알아?'
              },
              coach: {
                better: 'The goal of the game is to collect as many cards as you can before time runs out.',
                note: '규칙 설명은 The goal of the game is to ~로 시작하면 듣는 사람이 바로 이해해요.'
              }
            },
            {
              hints: ['You have to match the color or the number, or you draw a card.', 'The trick is to watch what the other players are doing.', 'Start with a card that gives you the most choices later.'],
              say: {
                en: 'Got it. And what happens if I have nothing to play? That happens to me a lot.',
                ko: '알겠어. 그런데 낼 카드가 없으면 어떻게 돼? 나는 그런 일이 자주 있거든.'
              },
              coach: {
                better: 'You have to match the color or the number, or you draw a card.',
                note: 'or를 두 번 써서 선택지를 이어 주면 규칙이 아주 명확해져요.'
              }
            },
            {
              hints: ['If you get stuck, you can trade two cards for one extra turn.', 'You just draw one and skip your turn — it is not a big deal.', 'That is when you use your wild card, but you only get one.'],
              say: {
                en: "Wait, I have a wild card? Why didn't you tell me earlier!",
                ko: '잠깐, 나한테 와일드 카드가 있다고? 왜 진작 말 안 했어!'
              },
              coach: {
                better: 'If you get stuck, you can trade two cards for one extra turn.',
                note: 'if you get stuck은 "막히면". trade A for B로 조건과 결과를 한 문장에 담아요.'
              }
            },
            {
              hints: ['I was saving that for the surprise, obviously.', 'I forgot, honestly — my cousin taught me a different rule.', "Because it's way more fun when you find it yourself."],
              say: {
                en: 'Okay, I think I finally get it. Any strategy I should know before we start?',
                ko: '좋아, 이제 드디어 이해한 것 같아. 시작 전에 알아야 할 전략 있어?'
              },
              coach: {
                better: 'I was saving that for the surprise, obviously.',
                note: 'obviously를 문장 끝에 붙이면 장난스러운 뉘앙스가 살아나요.'
              }
            },
            {
              hints: ['Keep your wild card until the last round — everyone does that.', 'Always count how many cards are left in the deck.', "Don't use your best card too early. That's the biggest mistake."],
              say: {
                en: "That's a real strategy! Okay, deal the cards. I'm going to win.",
                ko: '그건 진짜 전략이네! 좋아, 카드 돌려. 나 이길 거야.'
              },
              coach: {
                better: "Don't use your best card too early. That's the biggest mistake.",
                note: '명령문 + That\'s the biggest mistake로 전략을 강조하면 귀에 쏙 들어와요.'
              }
            }
          ],
          closing: {
            en: "Ha! We'll see about that. Deal!",
            ko: '하! 두고 보자. 카드 돌려!'
          }
        }
      ]
    }
  };

  /* 따라 말하기 피드백 문구 */
  window.SPEAKY_FEEDBACK = {
    adult: {
      perfect: ['완벽해요! 원어민 발음에 가까워요 🎉', '훌륭해요. 이 속도로 계속 가요!', '거의 다 맞았어요! 자신감이 느껴져요.'],
      great: ['좋아요! 몇 단어만 더 또렷하게 말해봐요 👍', '잘했어요. 강세를 조금만 더 살려볼까요?', '거의 다 됐어요! 한 번 더 말해보세요.'],
      ok: ['잘하고 있어요. 천천히 다시 한 번! 💪', '좋아요, 놓친 단어를 확인하고 다시 말해봐요.', '절반 이상 맞았어요. 속도를 조금 낮춰 볼까요?'],
      low: ['괜찮아요. 먼저 듣고 따라 말해볼까요? 🎧', '천천히 들어보고 한 단어씩 따라 해봐요.', '처음엔 다 그래요. 다시 도전!']
    },
    kid: {
      perfect: ['완벽해! 원어민처럼 자연스러워 🌟', '발음도 리듬도 최고야! 이 문장은 네 거야 👏', '정말 잘했어. 이제 네 말로 한 번 더 말해 볼까?'],
      great: ['좋아! 강세만 조금 더 살리면 완벽해 👍', '거의 다 됐어. 놓친 단어만 다시 짚어 보자.', '잘했어! 속도는 그대로, 단어 끝소리만 또렷하게.'],
      ok: ['좋아, 절반 넘게 맞았어. 다시 들어 보자 💪', '문장은 맞았어. 끊어 읽는 자리만 표시해 볼까?', '천천히 한 번, 그다음 자연스러운 속도로 한 번 더!'],
      low: ['괜찮아. 먼저 듣고 한 덩어리씩 따라 해 보자 🎧', '어려운 문장이야. 앞부분만 먼저 말해 볼까?', '도전한 게 멋져. 내 목소리 듣고 다시 한 번!' ]
    }
  };
})();
