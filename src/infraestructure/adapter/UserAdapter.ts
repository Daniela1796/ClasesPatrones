import { Repository } from "typeorm";
import { User as UserDomain } from "../../domain/Entities/User";
import { User as UserEntity } from "../entities/User";
import { UserPort } from "../../domain/Ports/UserPort";
import { AppDataSource } from "../config/data-base";

export class UserAdapter implements UserPort {
  private userRepository: Repository<UserEntity>;

  constructor() {
    this.userRepository = AppDataSource.getRepository(UserEntity);
  }

  //TRANSFORMA LA ENTIDAD DE INFRAESTRUCTURA(entities/user) al modelo de dominio(User)
  private toDomain(user: UserEntity): UserDomain {
    return {
      id: user.id_user,
      email: user.email_user,
      password: user.password_user,
      rol: user.rol,
      status: user.status_user,
    };
  }

  async getUserByEmail(email: string): Promise<UserDomain | null> {
    const user = await this.userRepository.findOne({
      where: { email_user: email },
    });

    if (!user) return null;
    

    return this.toDomain(user);
  }
}
