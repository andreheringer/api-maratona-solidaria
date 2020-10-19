import { StudentState } from './../app/shared/stores/students/students.state';
import { StudentService } from './../app/shared/stores/students/students.service';
import { PRODUCTS } from './../app/shared/models/product';
import { DonationState } from './../app/shared/stores/donations/donations.state';
import { DonationService } from './../app/shared/stores/donations/donations.service';
import { TeamState } from './../app/shared/stores/teams/teams.state';
import { HttpClientModule } from '@angular/common/http';
import { TeamService } from './../app/shared/stores/teams/teams.service';
import { Observable } from 'rxjs';
import { NgxsDispatchPluginModule } from '@ngxs-labs/dispatch-decorator';
import { Store } from '@ngxs/store';
import { NgxsModule } from '@ngxs/store';
import { TestBed } from '@angular/core/testing';

const donationStub = {
  doacao: 'Doação Teste',
  tipo: PRODUCTS[0].id,
  quantidade: 3,
  representante: {
    id: 0,
    nome: 'Henrique',
    matricula: 2016100000,
    curso: {
      id: 0,
      name: 'Ciência da Computação',
      points: 0,
      acronime: undefined,
    },
    email: 'henrique@mail.com',
    telefone: null,
    observacao: null,
  },
  data: null,
  pontuacao: PRODUCTS[0].points,
  observacao: null,
  confirmado: false,
};

const donationStub2 = {
  doacao: 'Doação Teste',
  tipo: PRODUCTS[0].id,
  quantidade: 3,
  representante: {
    id: 0,
    nome: 'Henrique',
    matricula: 2016100000,
    curso: {
      id: 0,
      name: 'Ciência da Computação',
      points: 0,
      size: 1,
    },
    email: 'henrique@mail.com',
    telefone: null,
    observacao: null,
  },
  data: null,
  pontuacao: PRODUCTS[0].points,
  observacao: null,
  confirmado: false,
};

const createTeamsRepositoryMock = (): any => {
  return {
    getClassificacao: () => {
      return new Observable((subscriber) => {
        subscriber.next([
          {
            id: 0,
            nome: 'Ciência da Computação',
            pontuacao: 0,
            tamanho: 1,
          },
        ]);
        subscriber.complete();
      });
    },
  };
};

const createStudentsRepositoryMock = (): any => {
  return {
    getStudents: () => {
      return new Observable((subscriber) => {
        subscriber.next([
          {
            id: 0,
            nome: 'Henrique',
            matricula: 2016100000,
            equipe_id: 0,
            email: 'henrique@mail.com',
            telefone: null,
            observacao: null,
          },
        ]);
        subscriber.complete();
      });
    },
    createStudent: (student) => {
      return new Observable((subscriber) => {
        subscriber.next({
          id: 0,
        });
        subscriber.complete();
      });
    },
  };
};

const createDonationsRepositoryMock = (): any => {
  return {
    getDonations: () => {
      return new Observable((subscriber) => {
        subscriber.next([
          {
            id: 0,
            doacao: 'Doação Teste',
            tipo: '0',
            quantidade: 3,
            aluno_id: 0,
            data: null,
            pontuacao: 100,
            observacao: null,
            confirmado: false,
          },
        ]);
        subscriber.complete();
      });
    },
    createDonation: (donation) => {
      return new Observable((subscriber) => {
        subscriber.next({
          donate_id: 0,
        });
        subscriber.complete();
      });
    },
    confirmDonation: (id) => {
      return new Observable((subscriber) => {
        subscriber.next({
          id: 0,
          doacao: 'Doação Teste',
          tipo: '0',
          quantidade: 3,
          aluno_id: 0,
          data: null,
          pontuacao: 100,
          observacao: null,
          confirmado: true,
        });
        subscriber.complete();
      });
    },
  };
};

describe('DonationService', () => {
  let store: Store;
  let donationService: DonationService;
  let teamService: TeamService;
  let studentService: StudentService;
  let teamsRepo = createTeamsRepositoryMock();
  let studentsRepo = createStudentsRepositoryMock();
  let donationsRepo = createDonationsRepositoryMock();

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        NgxsModule.forRoot([DonationState, TeamState, StudentState]),
        NgxsDispatchPluginModule,
        HttpClientModule,
      ],
    });

    store = TestBed.inject(Store);
    teamService = new TeamService(store, teamsRepo);
    studentService = new StudentService(store, studentsRepo, teamService);
    donationService = new DonationService(
      store,
      teamService,
      studentService,
      donationsRepo
    );
  });

  it('should start empty', () => {
    let allDonations: any[];
    let teamDonations: any[];

    donationService.allDonations$.subscribe((storeDonations) => {
      allDonations = storeDonations;
    });
    donationService.teamDonations$.subscribe((storeDonations) => {
      teamDonations = storeDonations;
    });

    expect(allDonations).toEqual([]);
    expect(teamDonations).toEqual([]);
  });

  it('should sync with mocked donations and add confirmed points', () => {
    let allDonations: any[];
    let allTeams: any[];

    teamService.allTeams$.subscribe((storeTeams) => {
      allTeams = storeTeams;
    });
    teamService.syncTeams();
    teamService.addTeamScore(0, 0); //setting acronime property
    studentService.syncStudents();

    donationService.syncDonations();
    donationService.allDonations$.subscribe((storeDonations) => {
      allDonations = storeDonations;
    });

    expect(allDonations).toEqual([
      {
        id: 0,
        ...donationStub,
      },
    ]);
    expect(allTeams).toEqual([
      {
        id: 0,
        name: 'Ciência da Computação',
        points: 0,
        acronime: undefined,
      },
    ]);
  });

  it('should create a donation', () => {
    //ARRANGE
    let allDonations: any[];

    studentService.syncStudents();

    //ACT
    donationService.allDonations$.subscribe((storeDonations) => {
      allDonations = storeDonations;
    });
    donationService.donate({
      id: null,
      ...donationStub,
    });

    //ASSERT
    expect(allDonations).toEqual([
      {
        id: 0,
        ...donationStub,
      },
    ]);
  });

  it('should confirm a donation', () => {
    let allDonations: any[];
    let allTeams: any[];
    teamService.syncTeams();
    studentService.syncStudents();

    teamService.allTeams$.subscribe((storeTeams) => {
      allTeams = storeTeams;
    });
    donationService.allDonations$.subscribe((storeDonations) => {
      allDonations = storeDonations;
    });
    donationService.syncDonations();
    donationService.confirmDonation(allDonations[0].id);

    expect(allDonations).toEqual([
      {
        id: 0,
        ...donationStub2,
        confirmado: true,
      },
    ]);
    expect(allTeams).toEqual([
      {
        id: 0,
        name: 'Ciência da Computação',
        points: PRODUCTS[0].points,
        acronime: undefined,
      },
    ]);
  });
});
