let problems = [
  {
    type: "TEXT",
    fileLink1: null,
    problemText:
      "프린세스 커넥트는 애니RPG를 표방하는 모바일게임이자 스트리머 따효니가 사랑하는 게임이다. 다음 중 옳은 문장은?",
    choice: [
      {
        text: "따효니는 2019년 6월에 이 게임을 시작했다.",
        answer: "false"
      },
      {
        text: "따효니는 지금까지 클랜전에서 한번도 빠진적이 없는 모범 유저다.",
        answer: "false"
      },
      {
        text:
          "따효니는 이 게임을 하는게 쪽팔려서 누구랑 같이 방송을 한적 없다.",
        answer: "false"
      },
      {
        text: "따효니는 10연차에서 3성을 3개나 먹은적 있다.",
        answer: "true"
      },
      {
        text: "스트리머 김도는 너무 운이 없어서 이 게임에 2000만원을 투자했다.",
        answer: "false"
      }
    ]
  },
  {
    type: "IMAGE",
    fileLink1:
      "https://duckhoogosa.s3.ap-northeast-2.amazonaws.com/practice01/violet-evergarden.jpg",
    fileLink2: null,
    problemText:
      "위 사진은 넷플릭스에서 독점서비스하는 바이올렛 에버가든의 일러스트다. 이 애니를 만든 회사는 쿄토애니메이션이다. 쿄토 애니메이션에서 만든 작품이 아닌것은?",
    choice: [
      {
        text: "빙과",
        answer: "false"
      },
      {
        text: "스즈미야 하루히의 우울",
        answer: "false"
      },
      {
        text: "케이온",
        answer: "false"
      },
      {
        text: "아이돌마스터",
        answer: "true"
      },
      {
        text: "울려라! 유포니엄",
        answer: "false"
      }
    ]
  },
  {
    type: "IMAGE",
    fileLink1:
      "https://duckhoogosa.s3.ap-northeast-2.amazonaws.com/practice01/sakuraquest.png",
    problemText:
      "위 이미지는 P.A.WORKS 의 일하는 소녀 시리즈 중 하나인 사쿠라 퀘스트의 일러스트다. 사쿠라퀘스트는 도시에서 살다가 지쳐서 우연히 농촌에서 일하게된 소녀의 이야기를 다루고 있다. 그건 그렇고 일하는 소녀 시리즈에 등장하는 여자 주인공의 직업을 모두 고르시오 (갯수제한없음)",
    choice: [
      {
        text: "프로그래머",
        answer: "true"
      },
      {
        text: "경찰관",
        answer: "false"
      },
      {
        text: "여관 청소부",
        answer: "true"
      },
      {
        text: "애니메이터",
        answer: "true"
      },
      {
        text: "마을의 왕",
        answer: "true"
      }
    ]
  },
  {
    type: "SOUND",
    fileLink1:
      "https://duckhoogosa.s3.ap-northeast-2.amazonaws.com/practice01/Zzapaguri.mp3",
    problemText: "이 음악은 어떤 영화의 OST이다. 영화의 이름은?",
    choice: [
      {
        text: "타이타닉",
        answer: "false"
      },
      {
        text: "기생충",
        answer: "true"
      },
      {
        text: "타짜",
        answer: "false"
      },
      {
        text: "명량",
        answer: "false"
      }
    ]
  },
  {
    type: "SOUND",
    fileLink1:
      "https://duckhoogosa.s3.ap-northeast-2.amazonaws.com/practice01/tuturu.mp3",
    problemText:
      "이 소리는 애니메이션 슈타인즈게이트의 어떤 캐릭터가 습관적으로 하는 대사다. 캐릭터에 대한 설명으로 옳지 않은것은?",
    choice: [
      {
        text: "고난에 좌절한 남자 주인공을 갱생시키기위해 시간여행을 한다.",
        answer: "false"
      },
      {
        text: "이름은 마유리다.",
        answer: "false"
      },
      {
        text: "예쁘지만 사실 남자다.",
        answer: "true"
      },
      {
        text: "남자 주인공이 만든 연구소의 첫번째 멤버다.",
        answer: "false"
      },
      {
        text: "문방구에서 뽑는 악세서리를 좋아한다.",
        answer: "false"
      }
    ]
  },
  {
    type: "VIDEO",
    fileLink1:
      "https://duckhoogosa.s3.ap-northeast-2.amazonaws.com/practice01/MIKURU_LEGEND.mp4",
    problemText:
      "이 영상은 어떤 애니메이션에 나오는 음악을 패러디한 영상이다. 음악의 이름과 이 영상에 나오는 밴드의 이름을 알맞게 연결한것은?",
    choice: [
      {
        text: "사랑의 미쿠루 전설 - X-JAPAN",
        answer: "true"
      },
      {
        text: "사랑의 미쿠루 전설 - Dragon force",
        answer: "false"
      },
      {
        text: "사랑의 미쿠루 전설 - L'Arc~en~Ciel",
        answer: "true"
      },
      {
        text: "21st Century Breakdown - Green Day",
        answer: "false"
      },
      {
        text: "21st Century Breakdown - BTS",
        answer: "false"
      }
    ]
  }
];

exports.problems = problems;
