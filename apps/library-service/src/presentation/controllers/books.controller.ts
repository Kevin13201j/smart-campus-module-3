import { UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../domain/enums/user-role.enum';
import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { CreateBookDto } from '../../application/dto/create-book.dto';
import { LoanBookDto } from '../../application/dto/loan-book.dto';
import { UpdateBookDto } from '../../application/dto/update-book.dto';
import { Book } from '../../domain/entities/book.entity';
import { BookLoan } from '../../domain/entities/book-loan.entity';
import { BookLoanStatus } from '../../domain/enums/book-loan-status.enum';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('books')
export class BooksController {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,

    @InjectRepository(BookLoan)
    private readonly bookLoanRepository: Repository<BookLoan>,
  ) {}

  @Get()
  @Roles(UserRole.ADMIN, UserRole.LIBRARIAN, UserRole.STUDENT)
  findAll() {
    return this.bookRepository.find();
  }

  @Get('search')
  @Roles(UserRole.ADMIN, UserRole.LIBRARIAN, UserRole.STUDENT)
  search(@Query('q') query: string) {
    if (!query) {
      return this.bookRepository.find();
    }

    return this.bookRepository.find({
      where: [
        { title: ILike(`%${query}%`) },
        { author: ILike(`%${query}%`) },
        { isbn: ILike(`%${query}%`) },
        { category: ILike(`%${query}%`) },
      ],
    });
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.LIBRARIAN, UserRole.STUDENT)
  async findOne(@Param('id') id: string) {
    const book = await this.bookRepository.findOne({ where: { id } });

    if (!book) {
      throw new NotFoundException('Book not found');
    }

    return book;
  }

  @Post()
  @Roles(UserRole.ADMIN, UserRole.LIBRARIAN)
  create(@Body() createBookDto: CreateBookDto) {
    const book = this.bookRepository.create({
      ...createBookDto,
      availableCopies: createBookDto.totalCopies,
    });

    return this.bookRepository.save(book);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.LIBRARIAN)
  async update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
    const book = await this.bookRepository.findOne({ where: { id } });

    if (!book) {
      throw new NotFoundException('Book not found');
    }

    Object.assign(book, updateBookDto);

    if (
      updateBookDto.totalCopies !== undefined &&
      book.availableCopies > updateBookDto.totalCopies
    ) {
      book.availableCopies = updateBookDto.totalCopies;
    }

    return this.bookRepository.save(book);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  async remove(@Param('id') id: string) {
    const book = await this.bookRepository.findOne({ where: { id } });

    if (!book) {
      throw new NotFoundException('Book not found');
    }

    await this.bookRepository.remove(book);

    return {
      message: 'Book deleted successfully',
    };
  }

  @Post(':id/loan')
  @Roles(UserRole.STUDENT, UserRole.LIBRARIAN, UserRole.ADMIN)
  async loanBook(@Param('id') id: string, @Body() loanBookDto: LoanBookDto) {
    const book = await this.bookRepository.findOne({ where: { id } });

    if (!book) {
      throw new NotFoundException('Book not found');
    }

    if (book.availableCopies <= 0) {
      throw new BadRequestException('Book is not available');
    }

    book.availableCopies -= 1;
    await this.bookRepository.save(book);

    const loan = this.bookLoanRepository.create({
      bookId: book.id,
      studentId: loanBookDto.studentId,
      loanDate: new Date(),
      status: BookLoanStatus.ACTIVE,
    });

    return this.bookLoanRepository.save(loan);
  }

  @Post(':id/return')
  @Roles(UserRole.STUDENT, UserRole.LIBRARIAN, UserRole.ADMIN)
  async returnBook(@Param('id') id: string, @Body() loanBookDto: LoanBookDto) {
    const book = await this.bookRepository.findOne({ where: { id } });

    if (!book) {
      throw new NotFoundException('Book not found');
    }

    const loan = await this.bookLoanRepository.findOne({
      where: {
        bookId: id,
        studentId: loanBookDto.studentId,
        status: BookLoanStatus.ACTIVE,
      },
    });

    if (!loan) {
      throw new NotFoundException('Active loan not found');
    }

    loan.status = BookLoanStatus.RETURNED;
    loan.returnDate = new Date();

    book.availableCopies += 1;

    await this.bookRepository.save(book);
    return this.bookLoanRepository.save(loan);
  }
}