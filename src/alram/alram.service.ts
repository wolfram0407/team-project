import { Injectable, MessageEvent } from '@nestjs/common';
import { Observable, Subject, filter, map } from 'rxjs';

@Injectable()
export class AlramService {
  private users$: Subject<any> = new Subject();

  private observer = this.users$.asObservable();

  // 이벤트 발생 함수
  emitCardChangeEvent(userId: number) {
    // next를 통해 이벤트를 생성
    this.users$.next({ userId: userId });
  }

  // 이벤트 연결
  sendClientAlarm(userId: number): Observable<any> {
    // 이벤트 발생시 처리 로직
    return this.observer.pipe(
      // 유저 필터링
      filter((user) => user.userId === userId),

      // 데이터 전송
      map((user) => {
        return {
          data: {
            message: `${userId}님이 언급하였습니다.${user}`,
          },
        } as MessageEvent;
      }),
    );
  }
}
